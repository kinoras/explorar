import pytest
from httpx import AsyncClient
from datetime import date, timedelta
from unittest.mock import AsyncMock

from app.core.exceptions import ErrorCode
from app.features.routing.schemas import TransitRoute, TravelMode
from app.features.routing.service import RouteService


##### Regular Requests #####


@pytest.mark.asyncio
async def test_compute_routes_success(client: AsyncClient, test_places, monkeypatch):
    # Prepare
    ids = [str(p.id) for p in test_places if p.region == "hong-kong"]
    today = date.today()

    # Mock: RouteService.compute
    fake_routes = [
        TransitRoute(
            origin=ids[0],
            destination=ids[1],
            distance=123,
            duration=234,
            polyline="#%$",
        )
    ]
    compute_mock = AsyncMock(return_value=fake_routes)
    monkeypatch.setattr(RouteService, "compute", compute_mock)

    # Status
    params = {"places": ids[:2], "date": today.isoformat(), "mode": TravelMode.TRANSIT}
    response = await client.post("/routes/compute", json=params)
    assert response.status_code == 200

    # Structure
    data = response.json()
    assert "routes" in data
    assert len(data["routes"]) == 1

    # Function call
    compute_mock.assert_awaited_once()
    _places, _date, _mode = compute_mock.await_args.kwargs.values()
    assert [str(p.id) for p in _places] == ids[:2]
    assert _date == today
    assert _mode == TravelMode.TRANSIT

    # Content
    assert data["routes"][0]["mode"] == TravelMode.TRANSIT
    assert data["routes"][0]["distance"] == 123
    assert data["routes"][0]["duration"] == 234
    assert data["routes"][0]["polyline"] == "#%$"


##### Exception Handling #####


@pytest.mark.asyncio
async def test_compute_routes_exceptions(client: AsyncClient, test_places):
    # Prepare
    hk_ids = [str(p.id) for p in test_places if p.region == "hong-kong"]
    mo_ids = [str(p.id) for p in test_places if p.region == "macau"]
    today = date.today()

    async def _request(places=hk_ids, date=today.isoformat(), mode=TravelMode.TRANSIT):
        json = {"places": places, "date": date, "mode": mode}
        return await client.post("/routes/compute", json=json)

    # Invalid date format
    response = await _request(date="2024-99-99")
    assert response.status_code == 422
    assert response.json().get("code") == ErrorCode.ROUTES_DATE_FORMAT

    # Invalid date range
    response = await _request(date=(today - timedelta(days=8)).isoformat())
    assert response.status_code == 422
    assert response.json().get("code") == ErrorCode.ROUTES_DATE_RANGE

    # Invalid travel mode
    response = await _request(mode="spaceship")
    assert response.status_code == 422
    assert response.json().get("code") == ErrorCode.ROUTES_METHOD_INVALID

    # Invalid places format (empty list)
    response = await _request(places=[])
    assert response.status_code == 422
    assert response.json().get("code") == ErrorCode.ROUTES_PLACES_FORMAT

    # Places across different regions
    response = await _request(places=[hk_ids[0], mo_ids[0]])
    assert response.status_code == 422
    assert response.json().get("code") == ErrorCode.ROUTES_PLACES_REGIONS

    # Places not found
    response = await _request(places=[hk_ids[0], "507f1f77bcf86cd799439011"])
    assert response.status_code == 404
    assert response.json().get("code") == ErrorCode.ROUTES_PLACES_NOTFOUND
