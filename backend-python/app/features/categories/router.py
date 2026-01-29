from typing import Optional
from fastapi import APIRouter, Query

from app.core.common import Region
from app.core.exceptions import error_models

from ..places import Place
from .schemas import CategoriesPublic, CategoryPublic


categories_router = APIRouter()


@categories_router.get(
    "",
    operation_id="get_categories",
    response_model=CategoriesPublic,
    responses=error_models([422, 500]),
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
