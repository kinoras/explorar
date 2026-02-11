from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Literal


type MessageRole = Literal["system", "user", "assistant"]
type ResponseMimeType = Literal["application/json", "text/plain"]
type ResponseSchema = dict[str, Any]


# Universal chat message format
@dataclass(frozen=True)
class ModelMessage:
    content: str
    role: MessageRole = "user"


# Request contract consumed by strategies
@dataclass(frozen=True)
class ModelRequest:
    messages: list[ModelMessage]
    temperature: float | None = None
    max_tokens: int | None = None
    response_type: ResponseMimeType | ResponseSchema = "application/json"


# Normalized model response
@dataclass(frozen=True)
class ModelResponse:
    text: str  # Primary textual response
    raw: dict[str, Any]  # Full response payload


# Abstract strategy interface
class ModelStrategy(ABC):
    @abstractmethod
    async def generate(self, payload: ModelRequest) -> ModelResponse: ...
