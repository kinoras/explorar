from typing import List
from collections import defaultdict

from app.core.common import PlaceId, Region

from .documents import Place


class PlaceNotFoundError(Exception):
    def __init__(self, missing_ids: List[str]):
        self.missing_ids = missing_ids


class PlaceRegionError(Exception):
    def __init__(self, regions_map: dict[Region, List[str]]):
        self.regions_map = regions_map


class PlaceService:
    """
    Advanced service for Place-related operations.
    """

    @staticmethod
    async def get_validated(
        ids: List[PlaceId],
        same_region: bool = True,
    ) -> List[Place]:
        """Retrieves places by ID and ensures they meet consistency rules.
        Args:
            ids (List[PlaceId]): List of Place IDs to retrieve.
            same_region (bool): Whether to enforce that all places are in the same region.
        Returns:
            List[Place]: List of retrieved Place objects.
        Raises:
            PlaceNotFoundError: If any of the specified places do not exist.
            PlaceRegionError: If the places are not all in the same region (when `same_region` is True).
        """
        # Retrieve places
        places = await Place.get_many(ids, preserve_order=True)

        # Check if all places exist
        if len(places) != len(ids):
            found_ids = {p.id for p in places}
            missing_ids = [str(id) for id in ids if id not in found_ids]
            raise PlaceNotFoundError(missing_ids=missing_ids)

        # Check if all places are in the same region
        if same_region and len({p.region for p in places}) > 1:
            regional_places = defaultdict(list[str])
            for p in places:
                regional_places[p.region].append(str(p.id))
            raise PlaceRegionError(regions_map=dict(regional_places))

        return places
