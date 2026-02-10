from typing import List
from datetime import date as _date

from app.core.common import PlaceId

from ..places import Place


class RoundRobinAssigner:
    @staticmethod
    def assign(
        dates: List[_date],
        places: List[Place],
    ) -> List[List[PlaceId]]:
        # Empty assignments
        assignments: List[List[PlaceId]] = [[] for _ in dates]

        # Distribute places using round-robin
        for idx, place in enumerate(places):
            day = idx % len(dates)
            assignments[day].append(place.id)

        return assignments
