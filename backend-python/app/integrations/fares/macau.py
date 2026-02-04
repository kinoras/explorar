import math
from typing import Optional
from google.maps.routing_v2 import RouteLeg

from app.utils.geometry import Coordinate, in_geofence, location_to_tuple

from .data import MACAU_GEOFENCE_POLYLINES


FARE_FIELDS_MO = [
    "routes.legs.startLocation",
    "routes.legs.endLocation",
    "routes.legs.duration.seconds",
    "routes.legs.distanceMeters",
]


# Constants
BASE_FARE, BASE_DISTANCE = 21.0, 1600  # meters
STEP_FARE, STEP_DISTANCE = 2.0, 220  # meters
STOP_FARE, STOP_DURATION = 2.0, 55  # seconds
SURCHARGE_TAIPA_COLOANE = 2.0
SURCHARGE_MACAU_COLOANE = 5.0
SURCHARGE_PORTS = 8.0
SURCHARGE_UM = 5.0


# Helper to check if a point is located within certain area(s) of Macau
def _in_area(point: Coordinate, area: str | list[str]) -> bool:
    return (
        in_geofence(point, MACAU_GEOFENCE_POLYLINES[area])
        if isinstance(area, str)
        else any(in_geofence(point, MACAU_GEOFENCE_POLYLINES[a]) for a in area)
    )


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
