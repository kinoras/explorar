from typing import List, Optional, TypeAlias
from beanie import PydanticObjectId
from pydantic import BaseModel, Field

from ..const import Category, Region


PlaceId: TypeAlias = PydanticObjectId


class Description(BaseModel):
    content: str
    source: str


class Location(BaseModel):
    address: str
    latitude: float
    longitude: float


class RegularHours(BaseModel):
    day: int
    open: str
    close: str


class Hours(BaseModel):
    timezone: str
    regular: List[RegularHours]
    exceptions: Optional[dict] = None


class Connection(BaseModel):
    type: str
    id: str


class PlaceBase(BaseModel):
    # Info
    name: str
    description: Description
    region: Region
    category: Category
    hours: Optional[Hours] = None
    location: Location

    # Media
    images: List[str] = Field(default_factory=list)

    # Rating
    rating: Optional[float] = None
    ranking: Optional[float] = None

    # Contact
    phone: Optional[str] = None
    website: Optional[str] = None
