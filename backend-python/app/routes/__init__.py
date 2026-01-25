from fastapi import APIRouter

from .category import category_router
from .place import place_router
from .route import route_router


router = APIRouter()
router.include_router(category_router, prefix="/categories", tags=["Categories"])
router.include_router(place_router, prefix="/places", tags=["Places"])
router.include_router(route_router, prefix="/routes", tags=["Routes"])
