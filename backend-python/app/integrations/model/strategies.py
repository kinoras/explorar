import asyncio
from typing import Any, Optional
from google import genai
from openai import AsyncOpenAI

from app.core.config import settings

from .contracts import ModelRequest, ModelResponse, ModelStrategy


class OpenAIModelStrategy(ModelStrategy):
    """Concrete strategy for OpenAI Response API."""

    def __init__(self, model: Optional[str] = None):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = model or settings.OPENAI_MODEL

    async def generate(self, payload: ModelRequest) -> ModelResponse:
        # Construct request body
        body: dict[str, Any] = {
            "model": self.model,
            "input": [{"role": m.role, "content": m.content} for m in payload.messages],
        }
        if isinstance(payload.response_type, dict):
            body["text"] = {
                "format": {
                    "name": "response_schema",
                    "type": "json_schema",
                    "strict": True,
                    "schema": payload.response_type,
                }
            }
        elif payload.response_type == "application/json":
            body["text"] = {"format": {"type": "json_object"}}
        if payload.temperature is not None:
            body["temperature"] = payload.temperature
        if payload.max_tokens is not None:
            body["max_output_tokens"] = payload.max_tokens

        # Request generation
        try:
            response = await self.client.responses.create(**body)
        except Exception as exc:
            raise RuntimeError(f"OpenAI request failed: {exc}") from exc

        # Parse response
        text = response.output_text
        if not text:
            raise RuntimeError("OpenAI response missing output text")
        return ModelResponse(text=text, raw=response.model_dump())


class GeminiModelStrategy(ModelStrategy):
    """Concrete strategy for Google Gemini API."""

    def __init__(self, model: Optional[str] = None):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model = model or settings.GEMINI_MODEL

    async def generate(self, payload: ModelRequest) -> ModelResponse:
        # Prepare messages
        instructions: list[str] = []
        contents: list[dict[str, str]] = []
        for message in payload.messages:
            if message.role == "system":
                instructions.append(message.content)
            elif message.role == "assistant":
                contents.append({"role": "model", "content": message.content})
            else:
                contents.append({"role": "user", "content": message.content})

        # Construct request config
        config: dict[str, Any] = {}
        if isinstance(payload.response_type, dict):
            config["response_mime_type"] = "application/json"
            config["response_json_schema"] = payload.response_type
        else:
            config["response_mime_type"] = payload.response_type
        if instructions:
            config["system_instruction"] = "\n".join(instructions)
        if payload.temperature is not None:
            config["temperature"] = payload.temperature
        if payload.max_tokens is not None:
            config["max_output_tokens"] = payload.max_tokens

        # Request generation
        try:
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model=self.model,
                contents=contents,
                config=config,
            )
        except Exception as exc:
            raise RuntimeError(f"Gemini request failed: {exc}") from exc

        # Parse response
        text = response.text
        if not text:
            raise RuntimeError("Gemini returned empty textual response")
        return ModelResponse(text=text, raw=response.model_dump())
