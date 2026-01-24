from typing import List
from pydantic import BaseModel

from ..const import Category


class CategoryPublic(BaseModel):
    category: Category
    count: int


class CategoriesPublic(BaseModel):
    categories: List[CategoryPublic]
