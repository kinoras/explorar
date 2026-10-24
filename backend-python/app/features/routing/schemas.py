from datetime import date as _date
from datetime import datetime, timedelta
from enum import Enum
from typing import Literal

from pydantic import BaseModel, field_validator

from app.core.common import PlaceId


class TravelMode(str, Enum):
    WALK = "walk"
    DRIVE = "drive"
    TRANSIT = "transit"


class Vehicle(str, Enum):
    BUS = "bus"
    TRAM = "tram"
    METRO = "metro"
    FERRY = "ferry"
    MIXED = "mixed"


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
    fare: float | None = None


class TransitRoute(RouteBase):
    mode: Literal[TravelMode.TRANSIT] = TravelMode.TRANSIT
    fare: float | None = None
    vehicle: Vehicle | None = None


type Route = WalkRoute | DriveRoute | TransitRoute


##### Public Schemas #####


class RoutesRequest(BaseModel):
    date: _date
    mode: TravelMode | None = TravelMode.TRANSIT
    places: list[PlaceId]

    @field_validator("date", mode="before")
    @classmethod
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
    @classmethod
    def validate_places(cls, v):
        if not v:
            raise ValueError("Places list cannot be empty")
        return v


class RoutesResponse(BaseModel):
    routes: list[Route]
