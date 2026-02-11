from datetime import date as _date

from ..places import Place
from ..places.schemas import Hours


class ItineraryPrompt:
    WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    @classmethod
    def instruction(cls) -> str:
        return (
            "You are an itinerary optimizer.\n"
            "Assign place indices to days with best practical order.\n"
            "Important: place index order is arbitrary and has no meaning.\n"
            "Treat each day list as an ordered visit route, not just a group.\n"
            "Primary objective: minimize travel distance and backtracking.\n"
            "When trade-offs exist, prioritize route compactness over preserving input order.\n"
            'Output only JSON: {"assignments": list[list[int]]}.\n'
            "Each integer is a place index.\n"
            "Hard rule: every place index must appear exactly once globally (no duplicates across or within day lists).\n"
            "Do not return markdown, prose, or explanations."
        )

    @classmethod
    def body(cls, dates: list[_date], places: list[Place]) -> str:
        return (
            f"{cls.task()}\n\n"
            f"{cls.dates(dates)}\n\n"
            f"{cls.places(places)}\n\n"
            f"{cls.rules(len(dates))}"
        )

    ##### Partial components #####

    @classmethod
    def task(cls) -> str:
        return (
            "# Task\n"
            "Assign places to trip days with practical optimization.\n\n"
            "## Objective Function\n"
            "Minimize total travel cost across all days.\n"
            "Use this proxy cost: for consecutive places A->B, cost = abs(latA-latB) + abs(lngA-lngB).\n"
            "Lower total consecutive-step cost is better.\n\n"
            "## Scoring Guidance (lower is better)\n"
            "- Heavy penalty: infeasible day assignment due to clear closed-day conflicts.\n"
            "- Heavy penalty: obvious backtracking pattern within a day.\n"
            "- Medium penalty: long consecutive jumps when shorter local alternatives exist.\n"
            "- Medium penalty: unbalanced day workloads when avoidable.\n"
            "- Medium penalty: empty days when a non-empty assignment is feasible.\n\n"
            "## Priority\n"
            "1. Hard constraints: output shape, use every index exactly once, valid day count.\n"
            "2. Feasibility: prefer places open on assigned day.\n"
            "3. Travel optimization: compact geographic clustering and short consecutive hops.\n"
            "4. Balance: keep day workloads reasonably balanced and avoid empty days when possible.\n\n"
            "## Method (internal)\n"
            "1. Build day groups by geographic closeness.\n"
            "2. Reorder each day into a short-hop path.\n"
            "3. Re-check for avoidable backtracking and improve if found.\n\n"
            "## Route Quality Rules\n"
            "- Minimize the sum of point-to-point movement within each day.\n"
            "- Avoid zig-zag routes and long jumps between consecutive places.\n"
            "- Avoid ping-pong patterns (A -> far B -> near A area).\n"
            "- Once a day starts in an area, finish nearby places before moving away.\n\n"
            "## Quality Gate Before Final Output\n"
            "- If output looks like simple sequential chunking (0,1,2... split by day), revise it unless coordinates clearly justify it.\n"
            "- If any day has an obvious backtrack pattern, revise day order to reduce it.\n"
            "- Prefer nearby consecutive coordinates over index order.\n\n"
            "## Day Coverage Gate\n"
            "- Avoid empty day lists when non-empty assignment is feasible.\n"
            "- Keep an empty day only when unavoidable (e.g., fewer places than days or hard feasibility constraints).\n\n"
            "## Uniqueness Gate\n"
            "- Every place index must appear exactly once in the full assignments output.\n"
            "- Duplicate index anywhere (same day or different days) is invalid and must be fixed before final output.\n"
            "- Missing index is also invalid and must be fixed before final output.\n\n"
            "## Mandatory Self-Check\n"
            "Before finalizing, perform two internal revision passes:\n"
            "1. Improve day grouping to reduce long inter-area jumps.\n"
            "2. Improve in-day order to reduce consecutive-step distance and backtracking.\n"
            "Then verify index coverage: no duplicates and no missing indices.\n"
            "If no improvement is possible, keep the current best route.\n\n"
            "## Notes\n"
            "- Place listing order is arbitrary and not a route hint.\n"
            "- Do not preserve input order unless it clearly improves optimization goals."
        )

    @classmethod
    def dates(cls, dates: list[_date]) -> str:
        prompt = "# Days\n"
        for idx, date in enumerate(dates, start=1):
            isodate = date.isoformat()  # e.g., 2026-01-01
            weekday = date.strftime("%a")  # e.g., Thu
            prompt += f"- Day {idx}: {isodate} ({weekday})\n"
        return prompt

    @classmethod
    def places(cls, places: list[Place]) -> str:
        prompt = "# Places\n"
        for idx, place in enumerate(places):
            prompt += (
                f"- Place #{idx}: {place.name}\n"
                f"  - Category: {place.category.value}\n"
                f"  - Location: ({place.location.latitude},{place.location.longitude})\n"
                f"  - Business hours: {cls._hours(place.hours) if place.hours else 'Open 24 hours\n'}"
            )
        return prompt

    @classmethod
    def rules(cls, day_count: int) -> str:
        return (
            "# Output Rules\n"
            '- Return only JSON in this exact shape: {"assignments": list[list[int]]}\n'
            f"- Outer list length must equal {day_count}\n"
            "- Use each place index exactly once\n"
            "- A place index must never appear in more than one slot or more than one day list\n"
            "- Use place indices only, never IDs or names\n"
            "- Reorder indices freely; input order should usually be ignored\n"
            "- Prefer assigning places to days when they are open\n"
            "- Prefer grouping geographically close places on the same day\n"
            "- For each day, order indices as a compact route with nearby consecutive locations\n"
            "- Balance day workloads when possible\n"
            "- Avoid empty days when feasible; keep empty days only when unavoidable\n"
            "- Avoid trivial sequential chunking (e.g., [0,1,2], [3,4,5], ...) unless it is clearly optimal\n"
            "- If uncertain between options, pick the one with shorter consecutive geographic hops"
        )

    ###### Helpers ######

    @classmethod
    def _hours(cls, hours: Hours) -> str:
        # Simplify hours objects to format: [["Sun", "Closed"], ["Mon", "09:00 - 17:00"]]
        hours_map = [[day, "Closed"] for day in cls.WEEKDAYS]
        for row in hours.regular:
            day = row.day % 7
            hours_map[day][1] = f"{row.open} - {row.close}"

        # Construct prompt string
        prompt = "\n"
        for entry in hours_map:
            prompt += f"    - {entry[0]}: {entry[1]}\n"
        return prompt
