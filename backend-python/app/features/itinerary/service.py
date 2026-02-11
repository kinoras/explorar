from typing import List
from datetime import date as _date

from ..places import Place
from .assigner import ModelAssigner
from .schemas import DayPlan


class ItineraryService:
    @classmethod
    async def plan(
        cls,
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

        # Skip assignment if no places
        if not places:
            return plans

        # Identify days available for assignment
        assignable_dates = cls._exclude_past_dates(dates) if skip_past_dates else dates

        # Assign with LLM
        assignments = await ModelAssigner().assign(
            dates=assignable_dates,
            places=places,
        )

        for date, assignment in zip(assignable_dates, assignments):
            # Populate places to the mapped plan
            plan = next((p for p in plans if p.date == date), plans[-1])
            for pid in assignment:
                plan.places.append(pid)

        return plans

    ##### Helpers ######

    @staticmethod
    def _exclude_past_dates(dates: List[_date], nonempty: bool = True) -> List[_date]:
        """Filter non-past dates.
        Args:
            dates (List[date]): List of dates to filter.
            nonempty (bool): If True, ensures at least one date is returned.
        Returns:
            List[date]: Filtered list of dates.
        """
        today = _date.today()
        assignable_dates = [date for date in dates if date >= today]
        if not dates:
            return []  # No dates provided (also avoid index error in nonempty logic)
        if not assignable_dates and nonempty:
            assignable_dates.append(dates[-1])  # At least 1 date to assign
        return assignable_dates
