from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException

from app.core.exceptions import ErrorCode, error_models

from ..places import Place
from .schemas import ItineraryRequest, ItineraryResponse
from .service import ItineraryService
from .deps import places_dep

itinerary_router = APIRouter()


@itinerary_router.post(
    "/plan",
    operation_id="plan_itinerary",
    responses=error_models([404, 422, 500]),
)
async def plan_itinerary(
    body: ItineraryRequest,
    places: list[Place] = Depends(places_dep),
) -> ItineraryResponse:
    try:
        dates = [body.start_date + timedelta(days=i) for i in range(body.duration)]
        plan = await ItineraryService.plan(
            dates=dates,
            places=places,
            skip_past_dates=True,
        )
        return ItineraryResponse(plan=plan)
    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail={
                "code": ErrorCode.ITINERARY_PLAN_FAILED,
                "message": "Failed to plan itinerary",
                "details": {"reason": str(e)},
            },
        )
