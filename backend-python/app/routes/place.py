from typing import List, Literal, Optional

from beanie import PydanticObjectId
from fastapi import APIRouter, HTTPException, Query

from app.core.exceptions import (
    NotFoundExceptionModel,
    UnprocessableEntityExceptionModel,
    InternalServerErrorExceptionModel,
)
from app.models.const import Region, Category, SortOrder
from app.models.place.api import PlacePublic, PlacesPublic
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
    response_model=PlacesPublic,
    responses={
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


@place_router.get(
    "/{id}",
    response_model=PlacePublic,
    responses={
        404: {"model": NotFoundExceptionModel},
        422: {"model": UnprocessableEntityExceptionModel},
        500: {"model": InternalServerErrorExceptionModel},
    },
)
async def get_place_by_id(
    id: PydanticObjectId,
) -> PlacePublic:
    # Fetch place
    place = await Place.get(id)

    # Handle not found
    if not place:
        raise HTTPException(
            status_code=404,
            detail={
                "message": "Place not found",
                "description": f"Place with id '{id}' does not exist",
            },
        )

    return PlacePublic(**place.model_dump())
