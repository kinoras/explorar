from enum import Enum


class Category(str, Enum):
    ENTERTAINMENT = "entertainment"
    HERITAGE = "heritage"
    LANDMARKS = "landmarks"
    MUSEUMS = "museums"
    NATURE = "nature"
    SHOPPING = "shopping"


class Region(str, Enum):
    HONG_KONG = "hong-kong"
    MACAU = "macau"
