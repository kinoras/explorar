import pytest
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

import app.integrations.model.strategies as strategies
from app.integrations.model.contracts import ModelMessage, ModelRequest


##### Helpers #####


def _response(text, raw=None):
    return SimpleNamespace(
        output_text=text,
        text=text,
        model_dump=lambda: raw or {"provider": "fake"},
    )


async def _run_inline(fn, *args, **kwargs):
    return fn(*args, **kwargs)


PAYLOAD = ModelRequest(
    messages=[
        ModelMessage(role="system", content="rules"),
        ModelMessage(role="assistant", content="context"),
        ModelMessage(role="user", content="question"),
    ],
    response_type={"type": "object"},
    temperature=0.3,
    max_tokens=128,
)


##### OpenAI #####


@pytest.mark.asyncio
async def test_openai_strategy_generate_success(monkeypatch):
    # Prepare
    create = AsyncMock(return_value=_response("done", {"id": "oa-1"}))
    client = SimpleNamespace(responses=SimpleNamespace(create=create))

    # Mock
    monkeypatch.setattr(strategies.settings, "OPENAI_API_KEY", "test-key")
    monkeypatch.setattr(strategies.settings, "OPENAI_MODEL", "gpt-test")
    monkeypatch.setattr(strategies, "AsyncOpenAI", lambda api_key: client)

    # Run
    strategy = strategies.OpenAIModelStrategy()
    response = await strategy.generate(PAYLOAD)
    call_kwargs = create.call_args.kwargs

    # Verify
    assert response.text == "done"
    assert response.raw == {"id": "oa-1"}
    assert call_kwargs["model"] == "gpt-test"
    assert call_kwargs["input"] == [
        {"role": "system", "content": "rules"},
        {"role": "assistant", "content": "context"},
        {"role": "user", "content": "question"},
    ]
    assert call_kwargs["temperature"] == PAYLOAD.temperature
    assert call_kwargs["max_output_tokens"] == PAYLOAD.max_tokens
    assert call_kwargs["text"]["format"]["type"] == "json_schema"


@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("result", "side_effect", "msg"),
    [
        (None, ValueError("bad request"), "OpenAI request failed"),
        (_response(None), None, "OpenAI response missing output text"),
    ],
)
async def test_openai_strategy_generate_errors(monkeypatch, result, side_effect, msg):
    # Prepare
    create = AsyncMock(return_value=result, side_effect=side_effect)
    client = SimpleNamespace(responses=SimpleNamespace(create=create))

    monkeypatch.setattr(strategies.settings, "OPENAI_API_KEY", "test-key")
    monkeypatch.setattr(strategies, "AsyncOpenAI", lambda api_key: client)

    # Verify raise
    strategy = strategies.OpenAIModelStrategy()
    with pytest.raises(RuntimeError, match=msg):
        await strategy.generate(PAYLOAD)


##### Gemini #####


@pytest.mark.asyncio
async def test_gemini_strategy_generate_success(monkeypatch):
    # Prepare
    generate_content = Mock(return_value=_response("done", {"id": "gm-1"}))
    client = SimpleNamespace(models=SimpleNamespace(generate_content=generate_content))

    # Mock
    monkeypatch.setattr(strategies.settings, "GEMINI_API_KEY", "test-key")
    monkeypatch.setattr(strategies.settings, "GEMINI_MODEL", "gemini-test")
    monkeypatch.setattr(strategies.asyncio, "to_thread", _run_inline)
    monkeypatch.setattr(strategies.genai, "Client", lambda api_key: client)

    # Run
    strategy = strategies.GeminiModelStrategy()
    response = await strategy.generate(PAYLOAD)
    call_kwargs = generate_content.call_args.kwargs

    # Verify
    assert response.text == "done"
    assert response.raw == {"id": "gm-1"}
    assert call_kwargs["model"] == "gemini-test"
    assert call_kwargs["contents"] == [
        {"role": "model", "parts": [{"text": "context"}]},
        {"role": "user", "parts": [{"text": "question"}]},
    ]
    assert call_kwargs["config"]["response_mime_type"] == "application/json"
    assert call_kwargs["config"]["response_json_schema"] == {"type": "object"}
    assert call_kwargs["config"]["system_instruction"] == "rules"
    assert call_kwargs["config"]["temperature"] == PAYLOAD.temperature
    assert call_kwargs["config"]["max_output_tokens"] == PAYLOAD.max_tokens


@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("result", "side_effect", "msg"),
    [
        (None, ValueError("provider error"), "Gemini request failed"),
        (_response(None), None, "Gemini returned empty textual response"),
    ],
)
async def test_gemini_strategy_generate_errors(monkeypatch, result, side_effect, msg):
    # Prepare
    generate_content = Mock(return_value=result, side_effect=side_effect)
    client = SimpleNamespace(models=SimpleNamespace(generate_content=generate_content))

    monkeypatch.setattr(strategies.settings, "GEMINI_API_KEY", "test-key")
    monkeypatch.setattr(strategies.asyncio, "to_thread", _run_inline)
    monkeypatch.setattr(strategies.genai, "Client", lambda api_key: client)

    # Verify raise
    strategy = strategies.GeminiModelStrategy()
    with pytest.raises(RuntimeError, match=msg):
        await strategy.generate(PAYLOAD)
