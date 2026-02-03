import pytest
from httpx import AsyncClient

from app.core.exceptions import ErrorCode


##### Regular Requests #####


@pytest.mark.asyncio
async def test_get_places(client: AsyncClient, test_places):
    # Status
    response = await client.get("/places")
    assert response.status_code == 200

    # Structure
    data = response.json()
    assert "places" in data

    # Content
    expected_ids = {str(p.id) for p in test_places}
    observed_ids = {place["id"] for place in data["places"]}
    assert observed_ids == expected_ids


@pytest.mark.asyncio
async def test_get_places_filtered(client: AsyncClient, test_places):
    # Test single and multiple categories
    for cats in [["entertainment"], ["landmarks", "museums"]]:
        # Status
        params = {"region": "hong-kong", "categories": ",".join(cats)}
        response = await client.get("/places", params=params)
        assert response.status_code == 200

        # Structure
        data = response.json()
        assert "places" in data

        # Content
        expected = [
            place
            for place in test_places
            if place.region.value == "hong-kong" and place.category.value in cats
        ]
        observed = data["places"]
        assert len(observed) == len(expected)
        assert all(place["category"] in cats for place in observed)


@pytest.mark.asyncio
async def test_get_places_sorted(client: AsyncClient, test_places):
    expected_ids = [str(p.id) for p in sorted(test_places, key=lambda p: -p.ranking)]
    observed_ids = []
    response_lengths = []

    # Paginated fetch
    cursor = None
    while True:
        params = {"orderBy": "ranking", "orderDir": "desc", "limit": 3}
        if cursor:
            params["cursor"] = cursor

        # Status
        response = await client.get("/places", params=params)
        assert response.status_code == 200

        # Structure
        data = response.json()
        assert "places" in data

        response_lengths.append(len(data["places"]))
        for place in data["places"]:
            observed_ids.append(place["id"])

        cursor = data.get("nextCursor")
        if cursor is None:
            break

    # Verify page size, order and completeness
    assert observed_ids == expected_ids
    assert all(length <= 3 for length in response_lengths[:-1])


@pytest.mark.asyncio
async def test_get_places_by_id(client: AsyncClient, test_places):
    # Test multiple places
    for place in test_places[0:2]:
        # Status
        response = await client.get(f"/places/{place.id}")
        assert response.status_code == 200

        # Content
        data = response.json()
        assert data["id"] == str(place.id)
        assert data["name"] == place.name


##### Exception Handling #####


@pytest.mark.asyncio
async def test_get_places_exceptions(client: AsyncClient):
    # Invalid category
    response = await client.get("/places", params={"categories": "invalid-category"})
    assert response.status_code == 422
    assert response.json().get("code") == ErrorCode.PLACES_CATEGORY_INVALID

    # Invalid region
    response = await client.get("/places", params={"region": "invalid-region"})
    assert response.status_code == 422
    assert response.json().get("code") == ErrorCode.PLACES_REGION_INVALID

    # Invalid sort field
    response = await client.get("/places", params={"orderBy": "invalid-field"})
    assert response.status_code == 422
    assert response.json().get("code") == ErrorCode.PLACES_ORDERBY_INVALID

    # Invalid limit
    response = await client.get("/places", params={"limit": -5})
    assert response.status_code == 422
    assert response.json().get("code") == ErrorCode.PLACES_LIMIT_FORMAT

    # Invalid cursor format
    response = await client.get("/places", params={"cursor": "not-a-valid-objectid"})
    assert response.status_code == 422
    assert response.json().get("code") == ErrorCode.PLACES_CURSOR_FORMAT


@pytest.mark.asyncio
async def test_get_places_by_id_exceptions(client: AsyncClient):
    # Invalid ID
    response = await client.get("/places/invalid-objectid")
    assert response.status_code == 422
    assert response.json().get("code") == ErrorCode.PLACE_ID_FORMAT

    # Non-existent ID
    response = await client.get("/places/507f1f77bcf86cd799439011")  # Fake ID
    assert response.status_code == 404
    assert response.json().get("code") == ErrorCode.PLACE_ID_NOTFOUND
