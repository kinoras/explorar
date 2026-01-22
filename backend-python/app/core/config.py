from typing import Annotated, Any, List
from pydantic import field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


def parse_csv(v: Any) -> List[str]:
    if isinstance(v, str):
        return [s.strip() for s in v.split(",") if s.strip()]
    if isinstance(v, list):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
        case_sensitive=True,
    )

    # Project
    PROJECT_NAME: str = "Explore HK MO API"
    API_V1_STR: str = "/api/v1"

    # MongoDB
    MONGO_CONNECTION_STRING: str = "mongodb+srv://user:pass@localhost:27017"
    MONGO_DATABASE: str = "explore"

    # CORS
    CORS_ORIGINS: Annotated[List[str], NoDecode] = []

    # CORS: Allow comma-separated list
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v) -> List[str]:
        if isinstance(v, str):
            return [x for x in v.split(",")]
        return []


settings = Settings()
