from typing import Optional

from fastapi import APIRouter, Query

from app.core.exceptions import (
    UnprocessableEntityExceptionModel,
    InternalServerErrorExceptionModel,
)
from app.models.const import Region
from app.models.place.db import Place
from app.models.category.api import CategoriesPublic, CategoryPublic

category_router = APIRouter()


@category_router.get(
    "",
    response_model=CategoriesPublic,
    responses={
        422: {"model": UnprocessableEntityExceptionModel},
        500: {"model": InternalServerErrorExceptionModel},
    },
)
async def get_categories(
    region: Optional[Region] = Query(None, description="Region"),
) -> CategoriesPublic:
    # Aggregation pipeline
    pipeline = []

    # Region filter
    if region:
        pipeline.append({"$match": {"region": region}})

    # Group and sort by category
    pipeline.append({"$group": {"_id": "$category", "count": {"$sum": 1}}})
    pipeline.append({"$sort": {"_id": 1}})

    # Query places
    categories = await Place.aggregate(pipeline).to_list()

    return CategoriesPublic(
        categories=[
            CategoryPublic(category=item["_id"], count=item["count"])
            for item in categories
        ]
    )
