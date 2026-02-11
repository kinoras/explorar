import pytest

from app.integrations.model.client import ModelClient, STRATEGIES, settings
from app.integrations.model.contracts import (
    ModelMessage,
    ModelRequest,
    ModelResponse,
    ModelStrategy,
)


##### Helpers #####


class DummyStrategy(ModelStrategy):
    def __init__(self, response: ModelResponse | None = None):
        self.response = response or ModelResponse(text="ok", raw={"source": "dummy"})
        self.last_payload = None

    async def generate(self, payload: ModelRequest) -> ModelResponse:
        self.last_payload = payload
        return self.response


class OpenAIStrategyStub(ModelStrategy):
    async def generate(self, payload: ModelRequest) -> ModelResponse:
        return ModelResponse(text="openai", raw={"provider": "openai"})


class GeminiStrategyStub(ModelStrategy):
    async def generate(self, payload: ModelRequest) -> ModelResponse:
        return ModelResponse(text="gemini", raw={"provider": "gemini"})


##### ModelClient #####


@pytest.mark.parametrize(
    ("provider", "strategy_cls"),
    [("openai", OpenAIStrategyStub), ("gemini", GeminiStrategyStub)],
)
def test_model_client(provider, strategy_cls, monkeypatch):
    # Mock: Strategy setting and registry map
    monkeypatch.setattr(settings, "MODEL_PROVIDER", provider)
    monkeypatch.setitem(STRATEGIES, "openai", OpenAIStrategyStub)
    monkeypatch.setitem(STRATEGIES, "gemini", GeminiStrategyStub)

    # Test default strategy
    client = ModelClient()
    assert isinstance(client.strategy, strategy_cls)


@pytest.mark.asyncio
async def test_model_client_generate():
    # Prepare
    strategy = DummyStrategy(response=ModelResponse(text="result", raw={"ok": True}))
    payload = ModelRequest(messages=[ModelMessage(role="user", content="hello")])
    client = ModelClient(strategy=strategy)

    # Test delegation
    response = await client.generate(payload)
    assert response.text == "result"
    assert strategy.last_payload == payload


@pytest.mark.asyncio
async def test_model_client_generate_errors():
    client = ModelClient(strategy=DummyStrategy())

    # Empty messages
    with pytest.raises(RuntimeError, match="At least one message is required"):
        await client.generate(payload=ModelRequest(messages=[]))
