from typing import List
from pydantic import BaseModel

from app.core.common import Category


##### Public Schemas #####


class CategoryPublic(BaseModel):
    category: Category
    count: int


class CategoriesPublic(BaseModel):
    categories: List[CategoryPublic]
