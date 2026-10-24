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
    regular: list[RegularHours]
    exceptions: dict | None = None


class PlaceBase(BaseModel):
    # Info
    name: str
    description: Description
    region: Region
    category: Category
    hours: Hours | None = None
    location: Location

    # Media
    images: list[str] = Field(default_factory=list)

    # Rating
    rating: float | None = None
    ranking: float | None = None

    # Contact
    phone: str | None = None
    website: str | None = None


##### Public Schemas #####


class PlacePublic(PlaceBase):
    # Object ID
    id: PlaceId


class PlacesPublic(BaseModel):
    places: list[PlacePublic]
    nextCursor: PlaceId | None = None
