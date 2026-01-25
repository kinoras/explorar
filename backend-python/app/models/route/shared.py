from enum import Enum
from typing import List, Optional
from pydantic import BaseModel

from app.models.place.shared import PlaceId


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
    mode: TravelMode = TravelMode.WALK


class DriveRoute(RouteBase):
    mode: TravelMode = TravelMode.DRIVE


class TransitRoute(RouteBase):
    mode: TravelMode = TravelMode.TRANSIT
