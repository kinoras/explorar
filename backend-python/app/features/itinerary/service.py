from typing import List
from datetime import date as _date

from ..places import Place
from .assigner import ModelAssigner
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

        # Skip assignment if no places
        if not places:
            return plans

        # Assign with LLM
        assignments = await ModelAssigner().assign(
            dates=[dates[idx] for idx in assignable_days],
            places=places,
        )

        for assignable_idx, place_ids in enumerate(assignments):
            # Map index: assignable days -> actual days
            day_idx = assignable_days[assignable_idx]
            # Populate places to the plan
            for place_id in place_ids:
                plans[day_idx].places.append(place_id)

        return plans
