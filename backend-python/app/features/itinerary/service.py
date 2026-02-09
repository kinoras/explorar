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
        """Plan an itinerary by distributing places across the provided dates.
        Args:
            dates (List[date]): List of dates for the trip.
            places (List[Place]): List of places to visit.
            skip_past_dates (bool): If True, places will not be assigned to dates in the past.
        Returns:
            List[DayPlan]: A list of daily plans with assigned places.
        """
        # Initialize plans
        plans = [
            (DayPlan(day=idx + 1, date=date, places=[]))
            for idx, date in enumerate(dates)
        ]

        # Identify days available for assignment
        today = _date.today()
        assignable_days = []  # Indices
        for idx, date in enumerate(dates):
            if not skip_past_dates or date >= today:
                assignable_days.append(idx)
        if not assignable_days:
            assignable_days.append(0)  # At least 1 day to assign

        # Distribute places using round-robin
        for idx, place in enumerate(places):
            day = assignable_days[idx % len(assignable_days)]
            plans[day].places.append(place.id)

        return plans
