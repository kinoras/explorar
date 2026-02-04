from typing import Optional

from google.maps.routing_v2 import RouteLeg, RouteTravelMode

from app.core.common import Region

from .macau import FARE_FIELDS_MO, MacauTaxiFareEstimator

FARE_FIELDS_REGISTRY = [
    "routes.legs.steps.travelMode",
]
FARE_FIELDS = set().union(FARE_FIELDS_REGISTRY, FARE_FIELDS_MO)


def compute_fare(region: Region, leg: RouteLeg) -> Optional[float]:
    steps = list(leg.steps or [])
    if not steps:
        return None

    # All DRIVE steps: Estimate taxi fare
    if all(step.travel_mode == RouteTravelMode.DRIVE for step in steps):
        if region == Region.MACAU:
            return MacauTaxiFareEstimator.compute(leg)
        if region == Region.HONG_KONG:
            return None  # Not implemented yet

    return None
