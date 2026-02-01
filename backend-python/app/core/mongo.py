from typing import Optional
from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from beanie import init_beanie

from app.core.config import settings
from app.features.places import Place

_client: Optional[AsyncMongoClient] = None


def get_client() -> AsyncMongoClient:
    """
    Mongo singleton client.
    """
    global _client
    if _client is None:
        uri = str(settings.MONGO_CONNECTION_STRING)
        _client = AsyncMongoClient(uri)
    return _client


def get_database() -> AsyncDatabase:
    """
    Get the Mongo database instance.
    """
    client = get_client()
    return client.get_database(settings.MONGO_DATABASE)


async def init_mongo() -> None:
    """
    Initialize Mongo + Beanie. Called once on startup.
    """
    client = get_client()
    try:
        # Simple ping test
        await client.admin.command("ping")
        # Initialize Beanie
        await init_beanie(
            database=client.get_database(settings.MONGO_DATABASE),
            document_models=[Place],
        )
    except Exception as e:
        raise Exception("Unable to initialize MongoDB/Beanie") from e


async def close_mongo() -> None:
    """
    Close the singleton client on shutdown.
    """
    global _client
    if _client is not None:
        await _client.close()
        _client = None
