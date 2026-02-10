from typing import Optional

from app.core.common import Model
from app.core.config import settings

from .contracts import ModelRequest, ModelResponse, ModelStrategy
from .strategies import GeminiModelStrategy, OpenAIModelStrategy


STRATEGIES: dict[Model, type[ModelStrategy]] = {
    "openai": OpenAIModelStrategy,
    "gemini": GeminiModelStrategy,
}


class ModelClient:
    def __init__(self, strategy: Optional[ModelStrategy] = None):
        self._strategy = strategy or self._create_default_strategy()

    @property
    def strategy(self) -> ModelStrategy:
        return self._strategy

    @strategy.setter
    def strategy(self, strategy: ModelStrategy) -> None:
        self._strategy = strategy

    @staticmethod
    def _create_default_strategy() -> ModelStrategy:
        strategy = STRATEGIES.get(settings.MODEL_PROVIDER)
        return strategy()

    async def generate(self, payload: ModelRequest) -> ModelResponse:
        if not payload.messages:
            raise RuntimeError("At least one message is required")
        return await self._strategy.generate(payload)
