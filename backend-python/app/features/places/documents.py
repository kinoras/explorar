from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field
from pymongo import ASCENDING, DESCENDING

from app.core.common import Category, Region, SortOrder

from .schemas import PlaceBase


class Connection(BaseModel):
    type: str
    id: str


##### Public Schemas #####


class Place(Document, PlaceBase):
    # Internal data
    connections: list[Connection] = Field(default_factory=list)

    class Settings:
        name = "places"

    @classmethod
    async def get_many(
        cls,
        ids: list[PydanticObjectId],
        preserve_order: bool = False,
    ) -> list["Place"]:
        # Retrieve places
        places = await cls.find({"_id": {"$in": ids}}).to_list()
        if not preserve_order:
            return places
        # Preserve order
        places_dict = {p.id: p for p in places}  # Index by ID
        return [places_dict[id] for id in ids if id in places_dict]  # Filter missing

    @classmethod
    async def query(
        cls,
        region: Region | None = None,
        categories: list[Category] | None = None,
        sort_field: str | None = "id",
        sort_order: SortOrder | None = SortOrder.DESCENDING,
        limit: int = 10,
        cursor: PydanticObjectId | None = None,
    ) -> tuple[list["Place"], PydanticObjectId | None]:
        # 0. Field mapping
        mongo_field = "_id" if sort_field == "id" else sort_field  # Mongo: id -> _id

        # 1. Standard filters
        query = {}
        if region:
            query["region"] = region
        if categories:
            query["category"] = {"$in": categories}

        # 2. Cursor-based pagination
        if cursor:
            # Fetch the reference document
            reference = await cls.get(cursor)
            if reference:
                value = getattr(reference, sort_field)
                field_operator = "$gt" if sort_order == SortOrder.ASCENDING else "$lt"
                cursor_operator = f"{field_operator}e"  # Inclusive on `_id`
                # Construct cursor filter
                cursor_filter = {
                    "$or": [
                        # Value is the same, but the `_id` is further
                        {mongo_field: value, "_id": {cursor_operator: cursor}},
                        # Value is further than the cursor
                        {mongo_field: {field_operator: value}},
                    ]
                }
                # Merge query filters
                query = {"$and": [query, cursor_filter]} if query else cursor_filter

        # 3. Execution
        sort_dir = ASCENDING if sort_order == SortOrder.ASCENDING else DESCENDING
        places = (
            await cls.find(query)
            .sort([(mongo_field, sort_dir), ("_id", sort_dir)])  # `_id` as tiebreaker
            .limit(limit + 1)  # Fetch one extra to get `next_cursor`
            .to_list()
        )

        # 4. Result
        has_more = len(places) > limit
        next_cursor = places[limit].id if has_more else None

        return places[:limit], next_cursor
