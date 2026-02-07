from typing import List
from pydantic import BaseModel, Field
from datetime import datetime, date as _date, time, timedelta

from google.api_core.client_options import ClientOptions
from google.maps import routing_v2
from google.protobuf import timestamp_pb2

from app.core.config import settings
from app.integrations.fares import FARE_FIELDS, compute_fare

from ..places import Place
from .schemas import TravelMode, Vehicle, Route, DriveRoute, TransitRoute, WalkRoute


MODE_MAP = {
    TravelMode.TRANSIT: routing_v2.RouteTravelMode.TRANSIT,
    TravelMode.WALK: routing_v2.RouteTravelMode.WALK,
    TravelMode.DRIVE: routing_v2.RouteTravelMode.DRIVE,
}
INVERSE_MODE_MAP = {v: k for k, v in MODE_MAP.items()}

VEHICLE_MAP = {
    routing_v2.TransitVehicle.TransitVehicleType.BUS: Vehicle.BUS,
    routing_v2.TransitVehicle.TransitVehicleType.TRAM: Vehicle.TRAM,
    routing_v2.TransitVehicle.TransitVehicleType.SUBWAY: Vehicle.METRO,
    routing_v2.TransitVehicle.TransitVehicleType.FERRY: Vehicle.FERRY,
}

SERVICE_FIELDS = [
    "routes.legs.distanceMeters",
    "routes.legs.duration",
    "routes.legs.polyline.encodedPolyline",
    "routes.legs.steps.travelMode",
    "routes.legs.steps.transitDetails.transitLine.vehicle.type",
]
FIELD_MASK = list(set().union(SERVICE_FIELDS, FARE_FIELDS))


class Segment(BaseModel):
    places: List[Place]
    mode: TravelMode = TravelMode.DRIVE  # Default: DRIVE
    departure: datetime = Field(
        default_factory=lambda: datetime.now(tz=settings.TIMEZONE)  # Default: now
    )


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
            List[datetime]: Evenly spaced datetimes between start and stop (both inclusive).\\
                            If num < 2, returns the midpoint between start and stop.
        """
        if num < 2:
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
    def create_segments(
        cls,
        places: List[Place],
        date: _date,
        mode: TravelMode,
    ) -> List[Segment]:
        segments: List[Segment] = []

        if mode == TravelMode.TRANSIT:  # No intermediates, 2 places per segment
            chunk_size = 2
        else:  # (DRIVE/WALK) Up to 10 places per segment
            chunk_size = 10

        idx = 0
        while idx < len(places) - 1:
            place_chunk = places[idx : idx + chunk_size]  # Place slice
            segments.append(Segment(places=place_chunk, mode=mode))
            idx += chunk_size - 1  # Overlap last place as first of next segment

        departure_times = cls.linspace_datetime(
            start=datetime.combine(date, time(9, 0), tzinfo=settings.TIMEZONE),  # 9:00
            stop=datetime.combine(date, time(18, 0), tzinfo=settings.TIMEZONE),  # 18:00
            num=(len(segments)),
        )

        for segment, departure in zip(segments, departure_times):
            if mode == TravelMode.TRANSIT:  # Use assigned time
                segment.departure = departure
            else:  # (DRIVE/WALK) Shift departure times into the future
                segment.departure = cls.shift_datetime_to_future(
                    dt=departure,
                    step=timedelta(days=7),  # Weekly increments
                    offset=timedelta(minutes=5),  # 5-minute buffer
                )

        return segments

    @staticmethod
    def extract_vehicle(steps: List[routing_v2.RouteLegStep]) -> Vehicle | None:
        # Extract unique vehicle types from transit steps
        vehicles = {
            step.transit_details.transit_line.vehicle.type_
            for step in steps
            if step.travel_mode == routing_v2.RouteTravelMode.TRANSIT
        }

        if len(vehicles) == 0:
            return None
        if len(vehicles) >= 2:
            return Vehicle.MIXED
        return VEHICLE_MAP.get(vehicles.pop(), None)

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

            # Compute fare if applicable
            fare = compute_fare(segment.places[idx].region, leg)

            # Extract vehicle type
            vehicle = cls.extract_vehicle(list(leg.steps or []))

            if mode == TravelMode.WALK:
                results.append(WalkRoute(**base_args))
            elif mode == TravelMode.DRIVE:
                results.append(DriveRoute(**base_args, fare=fare))
            elif mode == TravelMode.TRANSIT:
                results.append(TransitRoute(**base_args, fare=fare, vehicle=vehicle))

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
        # Form route segments
        segments = cls.create_segments(places=places, date=date, mode=mode)

        # Compute routes for segments
        routes = []
        for segment in segments:
            try:
                segment_routes = await cls.compute_segment(segment)
                routes.extend(segment_routes)
            except RuntimeError:  # Re-raise as is
                raise
            except ValueError as e:  # Wrap non-runtime errors
                raise RuntimeError(str(e)) from e

        return routes
