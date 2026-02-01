from typing import List
from collections import defaultdict
from fastapi import HTTPException

from app.core.exceptions import ErrorCode, ErrorModel

from ..places import Place
from .schemas import RoutesRequest


async def places_dep(body: RoutesRequest) -> List[Place]:
    # Retrieve places
    places = await Place.get_many(body.places, preserve_order=True)

    # Check if all places exist
    if len(places) != len(body.places):
        found_ids = {p.id for p in places}
        missing_ids = [str(id) for id in body.places if id not in found_ids]
        raise HTTPException(
            status_code=404,
            detail=ErrorModel(
                status=404,
                code=ErrorCode.ROUTES_PLACES_NOTFOUND,
                message="Some places not found",
                details={
                    "resource": "places",
                    "id": ",".join(missing_ids),
                },
            ),
        )

    # Check if all places are in the same region
    if len({p.region for p in places}) > 1:
        regional_places = defaultdict(list[str])
        for p in places:
            regional_places[p.region].append(str(p.id))
        raise HTTPException(
            status_code=422,
            detail=ErrorModel(
                status=422,
                code=ErrorCode.ROUTES_PLACES_FORMAT,
                message="Places are not in the same region",
                details={
                    "places.hk": ",".join(regional_places["hong-kong"]),
                    "places.mo": ",".join(regional_places["macau"]),
                },
            ),
        )

    return places
