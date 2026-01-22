from typing import List, Optional
from beanie import PydanticObjectId
from pydantic import BaseModel

from .shared import PlaceBase


class PlacePublic(PlaceBase):
    # Object ID
    id: PydanticObjectId


class PlacesPublic(BaseModel):
    places: List[PlacePublic]
    nextCursor: Optional[PydanticObjectId] = None
