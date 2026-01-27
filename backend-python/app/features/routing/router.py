from fastapi import APIRouter, Depends, HTTPException

from app.core.exceptions import (
    NotFoundExceptionModel,
    UnprocessableEntityExceptionModel,
    InternalServerErrorExceptionModel,
)

from ..places import Place
from .deps import places_dep
from .schemas import RoutesRequest, RoutesResponse
from .service import RouteService

routing_router = APIRouter()


@routing_router.post(
    "/compute",
    operation_id="compute_routes",
    responses={
        404: {"model": NotFoundExceptionModel},
        422: {"model": UnprocessableEntityExceptionModel},
        500: {"model": InternalServerErrorExceptionModel},
    },
)
async def compute_routes(
    body: RoutesRequest,
    places: list[Place] = Depends(places_dep),  # Prepare places
) -> RoutesResponse:
    try:
        routes = await RouteService.compute(places, body.date, body.mode)
        return RoutesResponse(routes=routes)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Failed to compute routes",
                "description": str(e),
            },
        )
