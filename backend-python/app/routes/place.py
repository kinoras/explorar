from typing import List, Literal, Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException, Query

from app.core.exceptions import (
    UnprocessableEntityExceptionModel,
    InternalServerErrorExceptionModel,
)
from app.models.const import Region, Category, SortOrder
from app.models.place.api import PlacesPublic
from app.models.place.db import Place

place_router = APIRouter()


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
            detail={
                "message": "Validation error",
                "description": f"categories: Input should be a comma-separated list of valid categories",
            },
        )


@place_router.get(
    "",
    responses={
        200: {"model": PlacesPublic},
        422: {"model": UnprocessableEntityExceptionModel},
        500: {"model": InternalServerErrorExceptionModel},
    },
)
async def get_places(
    region: Optional[Region] = Query(default=None),
    categories: Optional[str] = Query(default=None, description="Comma-separated list"),
    order_by: Literal["id", "ranking", "rating"] = Query(default="id", alias="orderBy"),
    order_dir: SortOrder = Query(default=SortOrder.ASCENDING, alias="orderDir"),
    limit: int = Query(default=10, ge=1, le=50),
    cursor: Optional[PydanticObjectId] = Query(default=None, description="Starting id"),
):
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
