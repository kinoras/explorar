from typing import Annotated, Any, List, Optional
from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict
from datetime import timezone, timedelta

from .common import Model


def parse_csv(v: Any) -> List[str]:
    if isinstance(v, str):
        return [s.strip() for s in v.split(",") if s.strip()]
    if isinstance(v, list):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local"),
        env_ignore_empty=True,
        extra="ignore",
        case_sensitive=True,
    )

    # Project
    PROJECT_NAME: str = "Explore HK MO API"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # MongoDB
    MONGO_CONNECTION_STRING: str = "mongodb+srv://user:pass@localhost:27017"
    MONGO_DATABASE: str = "explore"

    # Google Maps
    GOOGLE_MAPS_API_KEY: str

    # Itinerary LLM
    MODEL_PROVIDER: Model = "openai"
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o-mini"
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.0-flash"

    @model_validator(mode="after")
    def validate_model_config(self):
        if self.MODEL_PROVIDER == "openai" and not self.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is required when MODEL_PROVIDER='openai'")
        if self.MODEL_PROVIDER == "gemini" and not self.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is required when MODEL_PROVIDER='gemini'")
        return self

    # CORS
    CORS_ORIGINS: Annotated[List[str], NoDecode] = []

    # CORS: Allow comma-separated list
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v) -> List[str]:
        if isinstance(v, str):
            return [x.strip() for x in v.split(",") if x.strip()]
        return []

    # Environment
    TIMEZONE: timezone = timezone(offset=timedelta(hours=8))  # UTC+8


settings = Settings()
