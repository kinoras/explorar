from typing import List
from fastapi import HTTPException

from app.core.exceptions import ErrorCode, ErrorModel

from ..places import Place, PlaceService, PlaceNotFoundError, PlaceRegionError
from .schemas import ItineraryRequest


async def places_dep(body: ItineraryRequest) -> List[Place]:
    try:
        return await PlaceService.get_validated(
            body.places,
            same_region=True,
        )
    except PlaceNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=ErrorModel(
                status=404,
                code=ErrorCode.ITINERARY_PLACES_NOTFOUND,
                message="Some places not found",
                details={"resource": "places", "id": ",".join(e.missing_ids)},
            ),
        )
    except PlaceRegionError as e:
        raise HTTPException(
            status_code=422,
            detail=ErrorModel(
                status=422,
                code=ErrorCode.ITINERARY_PLACES_REGIONS,
                message="Places are not in the same region",
                details={
                    "places.hk": ",".join(e.regions_map.get("hong-kong", [])),
                    "places.mo": ",".join(e.regions_map.get("macau", [])),
                },
            ),
        )
