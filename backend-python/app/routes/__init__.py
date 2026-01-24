from fastapi import APIRouter

from .category import category_router
from .place import place_router


router = APIRouter()
router.include_router(category_router, prefix="/categories", tags=["Categories"])
router.include_router(place_router, prefix="/places", tags=["Places"])
