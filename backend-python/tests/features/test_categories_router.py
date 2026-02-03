import pytest
from httpx import AsyncClient
from collections import Counter

from app.core.exceptions import ErrorCode
from app.features.places import Place


@pytest.fixture(autouse=True)
def aggregate_compat(monkeypatch):
    # Async-compatible aggregate proxy for mongomock.
    # Purpose: To avoid AsyncIOMotorLatentCommandCursor await error
    class _AggregateProxy:
        def __init__(self, collection, pipeline, args, kwargs):
            self.collection = collection
            self.pipeline = pipeline
            self.args = args
            self.kwargs = kwargs

        async def to_list(self, *args, **kwargs):
            cursor = self.collection.aggregate(self.pipeline, *self.args, **self.kwargs)
            return await cursor.to_list(*args, **kwargs)

    def _aggregate(cls, pipeline, *args, **kwargs):
        collection = cls.get_pymongo_collection()
        return _AggregateProxy(collection, pipeline, args, kwargs)

    monkeypatch.setattr(Place, "aggregate", classmethod(_aggregate))


##### Regular Requests #####


@pytest.mark.asyncio
async def test_get_categories(client: AsyncClient, test_places):
    # Status
    response = await client.get("/categories")
    assert response.status_code == 200

    # Structure
    data = response.json()
    assert "categories" in data

    # Content
    counter = Counter([p.category for p in test_places])
    expected = {k.value: v for k, v in counter.items()}
    observed = {c["category"]: c["count"] for c in data["categories"]}
    assert observed == expected


@pytest.mark.asyncio
async def test_get_categories_with_region_filter(client: AsyncClient, test_places):
    for region in ["hong-kong", "macau"]:
        # Status
        response = await client.get("/categories", params={"region": region})
        assert response.status_code == 200

        # Structure
        data = response.json()
        assert "categories" in data

        # Content
        counter = Counter([p.category for p in test_places if p.region.value == region])
        expected = {k.value: v for k, v in counter.items()}
        observed = {c["category"]: c["count"] for c in data["categories"]}
        assert observed == expected


##### Exception Handling #####


@pytest.mark.asyncio
async def test_get_categories_exceptions(client: AsyncClient):
    # Invalid region
    response = await client.get("/categories", params={"region": "invalid-region"})
    assert response.status_code == 422
    assert response.json().get("code") == ErrorCode.CATEGORIES_REGION_INVALID
