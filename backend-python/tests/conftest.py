import pytest
from asgi_lifespan import LifespanManager
from httpx import AsyncClient, ASGITransport
from mongomock_motor import AsyncMongoMockClient as MongoMockMotorClient

from app.main import app
from app.core import mongo
from app.features.places import Place

from tests.data import get_dummy_places


# Wrapper for Database that handles beanie's list_collection_names parameters
class CompatibleAsyncDatabase:
    def __init__(self, db):
        self._db = db

    def __getattr__(self, name):
        return getattr(self._db, name)

    def __getitem__(self, key):
        return self._db[key]

    async def list_collection_names(self, **kwargs):
        # Strip out parameters that mongomock doesn't support
        # beanie might pass authorizedCollections, nameOnly, etc.
        return await self._db.list_collection_names()

    async def command(self, *args, **kwargs):
        return await self._db.command(*args, **kwargs)


# Wrapper to provide async close method and fix beanie compatibility
class AsyncMongoMockClient(MongoMockMotorClient):
    async def close(self):
        pass

    def get_database(self, name=None, *args, **kwargs):
        db = super().get_database(name, *args, **kwargs)
        return CompatibleAsyncDatabase(db)


@pytest.fixture(scope="session")
async def test_app():
    """Setup the application with the test database configuration."""
    # Override the MongoDB client with a compatible mock client
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
