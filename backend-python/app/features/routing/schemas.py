from typing import List, Literal, Optional
from enum import Enum
from pydantic import BaseModel, field_validator
from datetime import datetime, date as _date, timedelta

from app.core.common import PlaceId


class TravelMode(str, Enum):
    WALK = "walk"
    DRIVE = "drive"
    TRANSIT = "transit"


class RouteBase(BaseModel):
    origin: PlaceId
    destination: PlaceId
    mode: TravelMode
    distance: int  # Unit: meters
    duration: int  # Unit: seconds
    polyline: str  # Encoded polyline string


class WalkRoute(RouteBase):
    mode: Literal[TravelMode.WALK] = TravelMode.WALK


class DriveRoute(RouteBase):
    mode: Literal[TravelMode.DRIVE] = TravelMode.DRIVE


class TransitRoute(RouteBase):
    mode: Literal[TravelMode.TRANSIT] = TravelMode.TRANSIT


type Route = WalkRoute | DriveRoute | TransitRoute


##### Public Schemas #####


class RoutesRequest(BaseModel):
    date: _date
    mode: Optional[TravelMode] = TravelMode.TRANSIT
    places: List[PlaceId]

    @field_validator("date", mode="before")
    def parse_date(cls, v):
        # String (YYYY-MM-DD) to date conversion
        if isinstance(v, str):
            try:
                v = datetime.strptime(v, "%Y-%m-%d").date()
            except ValueError:
                raise ValueError("Date must be in format 'YYYY-MM-DD'")
        # Date range validation: D-7 to D+100
        if isinstance(v, _date):
            today = _date.today()
            if v < (today - timedelta(days=7)) or v > (today + timedelta(days=100)):
                raise ValueError("Date must be between D-7 and D+100 from today")
        # Validation passed
        return v

    @field_validator("places")
    def validate_places(cls, v):
        if not v:
            raise ValueError("Places list cannot be empty")
        return v


class RoutesResponse(BaseModel):
    routes: List[Route]
