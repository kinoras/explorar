from typing import List, Optional
from pydantic import BaseModel, Field

from app.core.common import Category, PlaceId, Region


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


##### Public Schemas #####


class PlacePublic(PlaceBase):
    # Object ID
    id: PlaceId


class PlacesPublic(BaseModel):
    places: List[PlacePublic]
    nextCursor: Optional[PlaceId] = None
