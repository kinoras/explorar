import pytest
from datetime import date, timedelta
from unittest.mock import AsyncMock

from app.features.itinerary.assigner import ModelAssigner
from app.features.itinerary.service import ItineraryService


##### Date Aliases #####


today = date.today()
tomorrow = today + timedelta(days=1)
yesterday = today - timedelta(days=1)
week_ago = today - timedelta(days=7)


##### Tests #####


@pytest.mark.parametrize(
    ("dates", "nonempty", "expected"),
    [
        ([yesterday, today, tomorrow], True, [today, tomorrow]),
        ([week_ago, yesterday], True, [yesterday]),
        ([week_ago, yesterday], False, []),
    ],
)
def test_exclude_past_dates(dates, nonempty, expected):
    assert ItineraryService._exclude_past_dates(dates, nonempty) == expected


@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("dates", "skip_past", "mock_assignments", "called_dates", "expected_plan"),
    [
        ([yesterday, today], True, [["A", "B"]], [today], [[], ["A", "B"]]),
        ([yesterday, today], False, [["A"], ["B"]], [yesterday, today], [["A"], ["B"]]),
    ],
)
async def test_plan(
    test_places,
    monkeypatch,
    dates,
    skip_past,
    mock_assignments,
    called_dates,
    expected_plan,
):
    # Prepare
    places = [p for p in test_places if p.region == "hong-kong"][:2]

    # Mock: ModelAssigner.assign
    assign_mock = AsyncMock(return_value=mock_assignments)
    monkeypatch.setattr(ModelAssigner, "assign", assign_mock)

    # Test
    plans = await ItineraryService.plan(dates, places, skip_past_dates=skip_past)
    assert assign_mock.await_args.kwargs["dates"] == called_dates
    assert assign_mock.await_args.kwargs["places"] == places
    assert [p.places for p in plans] == expected_plan


@pytest.mark.asyncio
async def test_plan_errors(test_places, monkeypatch):
    # Mock: ModelAssigner.assign
    monkeypatch.setattr(
        ModelAssigner,
        "assign",
        AsyncMock(side_effect=RuntimeError("boom")),
    )

    # Test raise on error
    with pytest.raises(RuntimeError, match="boom"):
        await ItineraryService.plan(
            dates=[today, tomorrow],
            places=[p for p in test_places if p.region == "hong-kong"][:2],
            skip_past_dates=True,
        )
