from fastapi import APIRouter, HTTPException

from app.core.exceptions import (
    NotFoundExceptionModel,
    UnprocessableEntityExceptionModel,
    InternalServerErrorExceptionModel,
)
from app.models.route.api import RoutesRequest, RoutesResponse
from app.models.place.db import Place

route_router = APIRouter()


@route_router.post(
    "/compute",
    responses={
        404: {"model": NotFoundExceptionModel},
        422: {"model": UnprocessableEntityExceptionModel},
        500: {"model": InternalServerErrorExceptionModel},
    },
)
async def compute_routes(body: RoutesRequest) -> RoutesResponse:
    # Retrieve places
    places = await Place.find({"_id": {"$in": body.places}}).to_list()

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

    # TODO: Compute routes using Google Maps Routes API

    return RoutesResponse(routes=[])  # Placeholder response
