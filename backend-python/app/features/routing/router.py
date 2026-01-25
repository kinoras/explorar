from fastapi import APIRouter, Depends

from app.core.exceptions import (
    NotFoundExceptionModel,
    UnprocessableEntityExceptionModel,
    InternalServerErrorExceptionModel,
)

from ..places import Place
from .deps import places_dep
from .schemas import RoutesRequest, RoutesResponse

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
    places: list[Place] = Depends(places_dep),
) -> RoutesResponse:
    return RoutesResponse(routes=[])  # Placeholder response
