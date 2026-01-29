from fastapi import APIRouter, Depends, HTTPException

from app.core.exceptions import ErrorCode, error_models

from ..places import Place
from .deps import places_dep
from .schemas import RoutesRequest, RoutesResponse
from .service import RouteService

routing_router = APIRouter()


@routing_router.post(
    "/compute",
    operation_id="compute_routes",
    responses=error_models([404, 422, 500]),
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
            status_code=422,
            detail={
                "code": ErrorCode.ROUTES_COMPUTE_FAILED,
                "message": "Failed to compute routes",
                "details": {"reason": str(e)},
            },
        )
