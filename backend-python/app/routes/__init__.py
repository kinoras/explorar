from fastapi import APIRouter

from .place import place_router


router = APIRouter()
router.include_router(place_router, prefix="/places", tags=["place"])
