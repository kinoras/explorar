from typing import List
from fastapi import HTTPException

from ..places import Place
from .schemas import RoutesRequest


async def places_dep(body: RoutesRequest) -> List[Place]:
    # Retrieve places
    places = await Place.get_many(body.places, preserve_order=True)

    # Check if all places exist
    if len(places) != len(body.places):
        found_ids = {p.id for p in places}
        missing_str = ",".join([f"'{id}'" for id in body.places if id not in found_ids])
        raise HTTPException(
            status_code=404,
            detail={
                "message": "Place not found",
                "description": f"places: Places {missing_str} could not be found",
            },
        )

    # Check if all places are in the same region
    if len({p.region for p in places}) > 1:
        raise HTTPException(
            status_code=422,
            detail={
                "message": "Places are in different regions",
                "description": "places: All places must be in the same region, either all in Hong Kong or all in Macau",
            },
        )

    return places
