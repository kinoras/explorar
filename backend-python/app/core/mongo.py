from typing import Optional
from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase
from beanie import init_beanie

from app.core.config import settings
from app.features.places import Place


class MongoManager:
    def __init__(self, uri: str, database: str):
        self.uri = uri
        self.database = database
        self.client: Optional[AsyncMongoClient] = None

    def get_client(self) -> AsyncMongoClient:
        """
        Get the Mongo client instance.
        """
        if self.client is None:
            self.client = AsyncMongoClient(self.uri)
        return self.client

    def get_database(self) -> AsyncDatabase:
        """
        Get the Mongo database instance.
        """
        client = self.get_client()
        return client.get_database(self.database)

    async def connect(self) -> None:
        """
        Initialize Mongo + Beanie. Called once on startup.
        """
        client = self.get_client()
        try:
            # Simple ping test
            await client.admin.command("ping")
            # Initialize Beanie
            await init_beanie(
                database=self.get_database(),
                document_models=[Place],
            )
        except Exception as e:
            raise Exception("Unable to initialize MongoDB/Beanie") from e

    async def close(self) -> None:
        """
        Close the singleton client on shutdown.
        """
        if self.client is not None:
            await self.client.close()
            self.client = None


db = MongoManager(
    uri=str(settings.MONGO_CONNECTION_STRING),
    database=settings.MONGO_DATABASE,
)
