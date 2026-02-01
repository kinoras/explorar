from typing import List, Literal, Optional
from fastapi import APIRouter, HTTPException, Query

from app.core.common import PlaceId, Region, Category, SortOrder
from app.core.exceptions import ErrorCode, ErrorModel, error_models

from .documents import Place
from .schemas import PlacePublic, PlacesPublic

places_router = APIRouter()


def _parse_categories(input: str) -> Optional[List[Category]]:
    """
    Parse a comma-separated string into a list of Category enums.
    Raise HTTPException 422 if any category is invalid.
    """
    try:
        categories = [Category(c.strip()) for c in input.split(",") if c.strip()]
        return categories
    except ValueError:
        raise HTTPException(
            status_code=422,
            detail=ErrorModel(
                status=422,
                code=ErrorCode.PLACES_CATEGORY_INVALID,
                message="Invalid categories",
                details={"categories": "Input should be csv string of categories"},
            ),
        )


@places_router.get(
    "",
    operation_id="get_places",
    response_model=PlacesPublic,
    responses=error_models([422, 500]),
)
async def get_places(
    region: Optional[Region] = Query(default=None),
    categories: Optional[str] = Query(default=None, description="Comma-separated list"),
    order_by: Literal["id", "ranking", "rating"] = Query(default="id", alias="orderBy"),
    order_dir: SortOrder = Query(default=SortOrder.ASCENDING, alias="orderDir"),
    limit: int = Query(default=10, ge=1, le=50),
    cursor: Optional[PlaceId] = Query(default=None, description="Starting id"),
) -> PlacesPublic:
    # Parse categories
    categories = _parse_categories(categories) if categories else None

    # Query places
    places, next_cursor = await Place.query(
        region=region,
        categories=categories,
        sort_field=order_by,
        sort_order=order_dir,
        limit=limit,
        cursor=cursor,
    )

    return PlacesPublic(
        places=[place.model_dump() for place in places],
        nextCursor=next_cursor,
    )


@places_router.get(
    "/{id}",
    operation_id="get_place_by_id",
    response_model=PlacePublic,
    responses=error_models([404, 422, 500]),
)
async def get_place_by_id(
    id: PlaceId,
) -> PlacePublic:
    # Fetch place
    place = await Place.get(id)

    # Handle not found
    if not place:
        raise HTTPException(
            status_code=404,
            detail=ErrorModel(
                status=404,
                code=ErrorCode.PLACE_ID_NOTFOUND,
                message="Place not found",
                details={"placeId": str(id)},
            ),
        )

    return PlacePublic(**place.model_dump())
