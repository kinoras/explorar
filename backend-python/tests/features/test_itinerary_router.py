import pytest
from httpx import AsyncClient
from datetime import date, timedelta
from unittest.mock import AsyncMock

from app.core.exceptions import ErrorCode
from app.features.itinerary.service import ItineraryService
from app.features.itinerary.schemas import DayPlan


##### Regular Requests #####


@pytest.mark.asyncio
async def test_plan_itinerary_success(client: AsyncClient, test_places, monkeypatch):
    # Prepare
    ids = [str(p.id) for p in test_places if p.region == "hong-kong"]
    today = date.today()

    # Mock: ItineraryService.plan
    fake_plan = [
        DayPlan(day=1, date=today, places=[ids[0], ids[1]]),
        DayPlan(day=2, date=today + timedelta(days=1), places=[ids[2]]),
    ]
    plan_mock = AsyncMock(return_value=fake_plan)
    monkeypatch.setattr(ItineraryService, "plan", plan_mock)

    # Status
    params = {"start_date": today.isoformat(), "duration": 2, "places": ids[:3]}
    response = await client.post("/itinerary/plan", json=params)
    assert response.status_code == 200

    # Structure
    data = response.json()
    assert "plan" in data
    assert len(data["plan"]) == 2
    assert data["plan"][0]["day"] == 1

    # Assignment completeness check
    assert set([pid for day in data["plan"] for pid in day["places"]]) == set(ids[:3])

    # Function call
    plan_mock.assert_awaited_once()
    _dates, _places, _skip = plan_mock.await_args.kwargs.values()
    assert _dates == [today, today + timedelta(days=1)]  # Today and tomorrow
    assert [str(p.id) for p in _places] == ids[:3]
    assert _skip is True


##### Exception Handling #####


@pytest.mark.asyncio
async def test_plan_itinerary_exceptions(client: AsyncClient, test_places):
    # Prepare
    hk_ids = [str(p.id) for p in test_places if p.region == "hong-kong"]
    mo_ids = [str(p.id) for p in test_places if p.region == "macau"]
    today = date.today()

    async def _request(places=hk_ids, start_date=today.isoformat(), duration=1):
        json = {"places": places, "start_date": start_date, "duration": duration}
        return await client.post("/itinerary/plan", json=json)

    # Invalid date format
    response = await _request(start_date="2024-99-99")
    assert response.status_code == 422
    assert response.json().get("code") == ErrorCode.ITINERARY_DATE_FORMAT

    # Invalid duration format
    response = await _request(duration="one")
    assert response.status_code == 422
    assert response.json().get("code") == ErrorCode.ITINERARY_DURATION_INVALID

    # Invalid places format (empty list)
    response = await _request(places=[])
    assert response.status_code == 422
    assert response.json().get("code") == ErrorCode.ITINERARY_PLACES_FORMAT

    # Places across different regions
    response = await _request(places=[hk_ids[0], mo_ids[0]])
    assert response.status_code == 422
    assert response.json().get("code") == ErrorCode.ITINERARY_PLACES_REGIONS

    # Places not found
    response = await _request(places=[hk_ids[0], "507f1f77bcf86cd799439011"])
    assert response.status_code == 404
    assert response.json().get("code") == ErrorCode.ITINERARY_PLACES_NOTFOUND
