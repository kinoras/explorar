import math
from typing import Optional
from google.maps.routing_v2 import RouteLeg, TransitVehicle

from app.utils.geometry import Coordinate, in_geofence, location_to_tuple

from .data import MACAU_GEOFENCE_POLYLINES, MACAU_LRT_STATIONS, MACAU_LRT_DISTANCE_TABLE


FARE_FIELDS_MO = [
    "routes.legs.startLocation",
    "routes.legs.endLocation",
    "routes.legs.duration.seconds",
    "routes.legs.distanceMeters",
    "routes.legs.steps.transitDetails.stopCount",
    "routes.legs.steps.transitDetails.transitLine.vehicle.type",
    "routes.legs.steps.transitDetails.stopDetails.arrivalStop.name",
    "routes.legs.steps.transitDetails.stopDetails.departureStop.name",
]


##### Constants #####


# Taxi
BASE_FARE, BASE_DISTANCE = 21.0, 1600  # meters
STEP_FARE, STEP_DISTANCE = 2.0, 220  # meters
STOP_FARE, STOP_DURATION = 2.0, 55  # seconds
SURCHARGE_TAIPA_COLOANE = 2.0
SURCHARGE_MACAU_COLOANE = 5.0
SURCHARGE_PORTS = 8.0
SURCHARGE_UM = 5.0

# Bus
BUS_FLAT_FARE = 6.0

# LRT
LRT_FARE_RULES = [(3, 6.0), (6, 8.0), (9, 10.0), (12, 12.0)]


##### Helper Functions #####


def _in_area(point: Coordinate, area: str | list[str]) -> bool:
    """Check if a point is located within certain area(s) of Macau"""
    return (
        in_geofence(point, MACAU_GEOFENCE_POLYLINES[area])
        if isinstance(area, str)
        else any(in_geofence(point, MACAU_GEOFENCE_POLYLINES[a]) for a in area)
    )


def _compare_station_names(name1: str, name2: str) -> bool:
    """Compare two LRT station names"""
    # Case insensitive
    a = name1.upper()
    b = name2.upper()
    # Test partial match
    return a == b or a in b or b in a


def _get_station_key(name: str) -> int:
    """Get LRT station index by its name (in any supported language)"""
    for idx, station in enumerate(MACAU_LRT_STATIONS):
        if any(_compare_station_names(name, n) for n in station):
            return idx
    return -1  # Not found


##### Fare Estimators #####


class MacauTaxiFareEstimator:
    @classmethod
    def compute(cls, leg: RouteLeg) -> Optional[float]:
        # Extract key data
        pickup = location_to_tuple(leg.start_location)
        dropoff = location_to_tuple(leg.end_location)
        duration = leg.duration.seconds
        distance = leg.distance_meters

        fare = cls._compute_distance_fare(distance)
        fare += cls._compute_stopping_fare(duration, distance)
        fare += cls._compute_surcharges(pickup, dropoff)
        return fare

    @staticmethod
    def _compute_distance_fare(distance: int) -> float:
        extra_distance = max(0.0, float(distance) - BASE_DISTANCE)
        increments = math.ceil(extra_distance / STEP_DISTANCE)
        return BASE_FARE + (increments * STEP_FARE)

    @staticmethod
    def _compute_stopping_fare(duration: int, distance: int) -> float:
        fastest_seconds = float(distance) * 0.06  # Using 60 km/h as reference
        extra_seconds = max(0.0, float(duration) - fastest_seconds)
        increments = math.ceil(extra_seconds / STOP_DURATION)
        return increments * STOP_FARE

    @staticmethod
    def _compute_surcharges(pickup: Coordinate, dropoff: Coordinate) -> float:
        surcharge = 0.0
        if _in_area(pickup, "TAIPA") and _in_area(dropoff, "COLOANE"):
            surcharge += SURCHARGE_TAIPA_COLOANE
        elif _in_area(pickup, "MACAU") and _in_area(dropoff, "COLOANE"):
            surcharge += SURCHARGE_MACAU_COLOANE
        if _in_area(pickup, ["HZMB", "AIRPORT", "TAIPAFERRY", "HENGQIN"]):
            surcharge += SURCHARGE_PORTS
        if _in_area(pickup, "UM"):
            surcharge += SURCHARGE_UM
        return surcharge


class MacauTransitFareEstimator:
    @classmethod
    def compute(cls, leg: RouteLeg) -> Optional[float]:
        steps = list(leg.steps or [])
        fare = 0.0

        # Track for transfer discounts
        # previous_bus_fare = None
        # previous_bus_time = None

        for idx, step in enumerate(steps):
            # Extract vehicle type
            vehicle = step.transit_details.transit_line.vehicle.type_

            # Bus
            if vehicle == TransitVehicle.TransitVehicleType.BUS:
                fare += cls._compute_bus_fare()

            # LRT
            elif vehicle == TransitVehicle.TransitVehicleType.TRAM:
                stops = step.transit_details.stop_count
                origin = step.transit_details.stop_details.departure_stop.name
                destination = step.transit_details.stop_details.arrival_stop.name

                # Merge consecutive LRT steps
                nxt = idx + 1
                if (
                    nxt < len(steps)  # Next step exists
                    and steps[nxt].transit_details.transit_line.vehicle.type_
                    == TransitVehicle.TransitVehicleType.TRAM  # Is (also) LRT
                ):
                    steps[nxt].transit_details.stop_count += stops - 1
                    steps[nxt].transit_details.stop_details.departure_stop.name = origin
                    continue

                fare += cls._compute_lrt_fare(origin, destination, stops)

        return fare or None

    @staticmethod
    def _compute_bus_fare() -> float:
        return BUS_FLAT_FARE

    @staticmethod
    def _compute_lrt_fare(origin: str, destination: str, stops: int) -> float:
        origin = _get_station_key(origin)
        destination = _get_station_key(destination)

        station_count = (
            stops  # Use inaccurate stop count
            if origin == -1 or destination == -1  # If either station key not found
            else MACAU_LRT_DISTANCE_TABLE[origin][destination]
        )

        for max_station, fare in LRT_FARE_RULES:
            if station_count <= max_station:
                return fare

        return LRT_FARE_RULES[-1][1]  # Use highest fare if exceeding maximum
