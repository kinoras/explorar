from fastapi import APIRouter

from app.models.place import PlacesPublic, Place

place_router = APIRouter()


@place_router.get("/", response_model=PlacesPublic)
async def get_places():
    places = await Place.find_all().to_list()
    return PlacesPublic(
        places=[place.model_dump() for place in places],
        nextCursor=None,
    )
