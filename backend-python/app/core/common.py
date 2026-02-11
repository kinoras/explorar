from typing import Literal
from enum import StrEnum
from beanie import PydanticObjectId


class Category(StrEnum):
    ENTERTAINMENT = "entertainment"
    HERITAGE = "heritage"
    LANDMARKS = "landmarks"
    MUSEUMS = "museums"
    NATURE = "nature"
    SHOPPING = "shopping"


class Region(StrEnum):
    HONG_KONG = "hong-kong"
    MACAU = "macau"


class SortOrder(StrEnum):
    ASCENDING = "asc"
    DESCENDING = "desc"

    @classmethod
    def _missing_(cls, value):
        # Case-insensitive matching
        value = value.lower()
        for member in cls:
            if member.value == value:
                return member

        # Default to ASCENDING
        return cls.ASCENDING


type PlaceId = PydanticObjectId


type Model = Literal["openai", "gemini"]
