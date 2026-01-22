from typing import List
from pydantic import Field
from beanie import Document

from .shared import PlaceBase, Connection


class Place(Document, PlaceBase):
    # Internal data
    connections: List[Connection] = Field(default_factory=list)

    class Settings:
        name = "places"
