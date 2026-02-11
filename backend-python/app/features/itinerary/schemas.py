from typing import List
from pydantic import BaseModel, field_validator
from datetime import datetime, date as _date

from app.core.common import PlaceId


class DayPlan(BaseModel):
    day: int
    date: _date
    places: List[PlaceId]


##### Public Schemas #####


class ItineraryRequest(BaseModel):
    start_date: _date
    duration: int
    places: List[PlaceId]

    @field_validator("start_date", mode="before")
    @classmethod
    def parse_start_date(cls, v):
        # String (YYYY-MM-DD) to date conversion
        if isinstance(v, str):
            try:
                v = datetime.strptime(v, "%Y-%m-%d").date()
            except ValueError:
                raise ValueError("Date must be in format 'YYYY-MM-DD'")
        return v

    @field_validator("duration")
    @classmethod
    def validate_duration(cls, v):
        if v <= 0:
            raise ValueError("Duration must be a positive integer")
        return v

    @field_validator("places")
    @classmethod
    def validate_places(cls, v):
        if not v:
            raise ValueError("Places list cannot be empty")
        return v


class ItineraryResponse(BaseModel):
    plan: List[DayPlan]
