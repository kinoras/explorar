import pytest
from asgi_lifespan import LifespanManager
from httpx import AsyncClient, ASGITransport
from mongomock_motor import AsyncMongoMockClient

from app.main import app
from app.core import mongo
from app.features.places import Place

from tests.data import get_dummy_places


@pytest.fixture(scope="session")
async def test_app():
    """Setup the application with the test database configuration."""
    # Override the MongoDB client with a mock client
    mongo.AsyncMongoClient = AsyncMongoMockClient

    async with LifespanManager(app) as manager:
        yield manager.app


@pytest.fixture
async def test_places(test_app):
    """Seed the database with dummy places."""
    # Setup: Insert dummy places
    await Place.insert_many(get_dummy_places())
    # Fetch back places with IDs
    places = await Place.find_all().to_list()
    yield places
    # Teardown: Clean up to ensure isolation
    await Place.delete_all()


@pytest.fixture
async def client(test_app):
    """Provide an asynchronous client for tests."""
    async with AsyncClient(
        transport=ASGITransport(app=test_app),
        base_url="http://test",
    ) as ac:
        yield ac
