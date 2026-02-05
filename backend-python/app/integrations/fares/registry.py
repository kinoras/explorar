from typing import Optional

from google.maps.routing_v2 import RouteLeg, RouteTravelMode

from app.core.common import Region

from .macau import FARE_FIELDS_MO, MacauTaxiFareEstimator, MacauTransitFareEstimator


FARE_FIELDS = set().union(["routes.legs.steps.travelMode"], FARE_FIELDS_MO)


def compute_fare(region: Region, leg: RouteLeg) -> Optional[float]:
    steps = {step.travel_mode for step in leg.steps or []}
    if not steps:
        return None

    # WALK only: Completely free
    if steps == {RouteTravelMode.WALK}:
        return 0.0

    # DRIVE only: Estimate taxi fare
    if steps == {RouteTravelMode.DRIVE}:
        if region == Region.MACAU:
            return MacauTaxiFareEstimator.compute(leg)
        if region == Region.HONG_KONG:
            return None  # Not implemented yet

    # TRANSIT & WALK: Estimate transit fare
    if steps == {RouteTravelMode.TRANSIT, RouteTravelMode.WALK}:
        if region == Region.MACAU:
            return MacauTransitFareEstimator.compute(leg)
        if region == Region.HONG_KONG:
            return None  # Not implemented yet

    return None
