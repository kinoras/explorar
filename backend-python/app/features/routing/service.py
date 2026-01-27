from typing import List
from pydantic import BaseModel
from datetime import datetime, date as _date, time, timedelta

from google.api_core.client_options import ClientOptions
from google.maps import routing_v2
from google.protobuf import timestamp_pb2

from app.core.config import settings

from ..places import Place
from .schemas import TravelMode, Route, DriveRoute, TransitRoute, WalkRoute


class Segment(BaseModel):
    places: List[Place]
    mode: TravelMode = TravelMode.DRIVE  # Default: DRIVE
    departure: datetime = datetime.now(tz=settings.TIMEZONE)  # Default: now


MODE_MAP = {
    TravelMode.TRANSIT: routing_v2.RouteTravelMode.TRANSIT,
    TravelMode.WALK: routing_v2.RouteTravelMode.WALK,
    TravelMode.DRIVE: routing_v2.RouteTravelMode.DRIVE,
}
INVERSE_MODE_MAP = {v: k for k, v in MODE_MAP.items()}


FIELD_MASK = [
    "routes.legs.distanceMeters",
    "routes.legs.duration",
    "routes.legs.polyline.encodedPolyline",
    "routes.legs.steps.travelMode",
]


class RouteService:
    @staticmethod
    def linspace_datetime(
        start: datetime,
        stop: datetime,
        num: int,
    ) -> List[datetime]:
        """Generate evenly spaced datetimes over an interval.
        Args:
            start (datetime): Start of the interval.
            stop (datetime): stop of the interval.
            num (int): Number of datetimes to generate.
        Returns:
            List[datetime]: Evenly spaced datetimes between start and stop (both inclusive).
        """
        if num == 1:
            return [start + (stop - start) / 2]
        step = (stop - start) / (num - 1)
        return [start + i * step for i in range(num)]

    @staticmethod
    def shift_datetime_to_future(
        dt: datetime,
        step: timedelta = timedelta(days=7),
        offset: timedelta = timedelta(0),
    ) -> datetime:
        """Shift `dt` forward in `step` increments until it is >= now + `offset`.
        Args:
            dt (datetime): Original datetime.
            step (timedelta): Step size to shift `dt` forward. Defaults to 7 days.
            offset (timedelta): Offset added to current time to define "future". Defaults to 0.
        Returns:
            datetime: Shifted datetime in the future.
        """
        now = datetime.now(tz=settings.TIMEZONE) + offset
        if dt >= now:
            return dt
        delta = now - dt
        steps = (delta // step) + 1
        return dt + (step * steps)

    @staticmethod
    def place_to_waypoint(place: Place) -> routing_v2.Waypoint:
        return routing_v2.Waypoint(
            location=routing_v2.Location(
                lat_lng={
                    "latitude": place.location.latitude,
                    "longitude": place.location.longitude,
                }
            )
        )

    @classmethod
    async def compute_segment(cls, segment: Segment) -> List[Route]:
        # ================================
        #  Prepare Request
        # ================================

        origin = cls.place_to_waypoint(segment.places[0])
        destination = cls.place_to_waypoint(segment.places[-1])
        intermediates = [cls.place_to_waypoint(p) for p in segment.places[1:-1]]

        travel_mode = MODE_MAP.get(segment.mode, routing_v2.RouteTravelMode.DRIVE)

        departure_timestamp = timestamp_pb2.Timestamp()
        departure_timestamp.FromDatetime(segment.departure)

        field_mask = ",".join(FIELD_MASK)
        routing_preference = (
            routing_v2.RoutingPreference.TRAFFIC_AWARE
            if travel_mode == routing_v2.RouteTravelMode.DRIVE  # DRIVING: Traffic-aware
            else routing_v2.RoutingPreference.ROUTING_PREFERENCE_UNSPECIFIED
        )

        # ================================
        #  Make Request
        # ================================

        try:
            options = ClientOptions(api_key=settings.GOOGLE_MAPS_API_KEY)
            client = routing_v2.RoutesAsyncClient(client_options=options)
            response = await client.compute_routes(
                request=routing_v2.ComputeRoutesRequest(
                    origin=origin,
                    destination=destination,
                    intermediates=intermediates,
                    travel_mode=travel_mode,
                    routing_preference=routing_preference,
                    departure_time=departure_timestamp,
                    compute_alternative_routes=False,
                ),
                metadata=[("x-goog-fieldmask", field_mask)],
            )
        except Exception as e:
            raise RuntimeError(f"Routes API Error: {str(e)}")

        # ================================
        #  Parse Response
        # ================================

        if not response.routes:
            return []

        results = []

        for idx, leg in enumerate(response.routes[0].legs):
            # Index bound check
            if idx >= len(segment.places) - 1:
                break

            base_args = {
                "origin": segment.places[idx].id,
                "destination": segment.places[idx + 1].id,
                "distance": leg.distance_meters,
                "duration": leg.duration.seconds,
                "polyline": leg.polyline.encoded_polyline,
            }

            mode = segment.mode

            # Override segment mode if all steps share the same travel mode
            if len({step.travel_mode for step in leg.steps}) == 1:
                mode = INVERSE_MODE_MAP.get(leg.steps[0].travel_mode, segment.mode)

            if mode == TravelMode.WALK:
                results.append(WalkRoute(**base_args))
            elif mode == TravelMode.DRIVE:
                results.append(DriveRoute(**base_args))
            elif mode == TravelMode.TRANSIT:
                results.append(TransitRoute(**base_args))

        return results

    @classmethod
    async def compute(
        cls,
        places: List[Place],
        date: _date,
        mode: TravelMode,
    ) -> List[Route]:
        """Compute routes for a list of places on a given date and travel mode.
        Args:
            places (List[Place]): List of waypoint places.
            date (date): Date of travel.
            mode (TravelMode): The selected travel mode.
        Returns:
            List[Route]: Computed routes between the places.
        Raises:
            RuntimeError: If route computation fails.
        """
        # ================================
        #  Form route segments
        # ================================

        segments: List[Segment] = []

        # TRANSIT: No intermediates, 2 places per segment
        if mode == TravelMode.TRANSIT:
            chunk_size = 2

        # DRIVE/WALK: Up to 10 places per segment
        else:
            chunk_size = 10

        idx = 0
        while idx < len(places) - 1:
            place_chunk = places[idx : idx + chunk_size]  # Place slice
            segments.append(Segment(places=place_chunk, mode=mode))
            idx += chunk_size - 1  # Overlap last place as first of next segment

        # ================================
        #  Assign departure times
        # ================================

        departure_times = cls.linspace_datetime(
            start=datetime.combine(date, time(9, 0), tzinfo=settings.TIMEZONE),  # 9:00
            stop=datetime.combine(date, time(18, 0), tzinfo=settings.TIMEZONE),  # 18:00
            num=len(segments),
        )

        for idx, segment in enumerate(segments):
            # TRANSIT: Use assigned time
            if mode == TravelMode.TRANSIT:
                segment.departure = departure_times[idx]

            # DRIVE/WALK: Shift departure times into the future
            else:
                segment.departure = cls.shift_datetime_to_future(
                    dt=departure_times[idx],
                    step=timedelta(days=7),  # Weekly increments
                    offset=timedelta(minutes=5),  # 5-minute buffer
                )

        # ================================
        #  Compute routes for segments
        # ================================

        routes = []

        for segment in segments:
            try:
                segment_routes = await cls.compute_segment(segment)
                routes.extend(segment_routes)

            # Propagate errors as runtime errors
            except (RuntimeError, ValueError) as e:
                raise RuntimeError(str(e))

        return routes
