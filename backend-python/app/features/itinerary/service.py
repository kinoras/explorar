from typing import List
from datetime import date as _date

from app.features.places.documents import Place

from .schemas import DayPlan


class ItineraryService:
    @staticmethod
    async def plan(
        dates: List[_date],
        places: List[Place],
        skip_past_dates: bool = True,
    ) -> List[DayPlan]:
        # TODO: Implement the actual planning logic.
        return [
            (DayPlan(day=idx + 1, date=date, places=[]))
            for idx, date in enumerate(dates)
        ]
