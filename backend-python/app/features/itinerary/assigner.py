import json
import jsonschema
import re
from typing import List, Optional
from datetime import date as _date

from app.core.common import PlaceId
from app.integrations.model import ModelClient, ModelMessage, ModelRequest

from ..places import Place

from .prompt import ItineraryPrompt


class RoundRobinAssigner:
    @staticmethod
    def assign(
        dates: List[_date],
        places: List[Place],
    ) -> List[List[PlaceId]]:
        # Empty assignments
        assignments: List[List[PlaceId]] = [[] for _ in dates]

        # Distribute places using round-robin
        for idx, place in enumerate(places):
            day = idx % len(dates)
            assignments[day].append(place.id)

        return assignments


class ModelAssigner:
    RESPONSE_SCHEMA = {
        "type": "object",
        "additionalProperties": False,
        "required": ["assignments"],
        "properties": {
            "assignments": {
                "type": "array",
                "items": {"type": "array", "items": {"type": "integer", "minimum": 0}},
            }
        },
    }

    def __init__(self, client: Optional[ModelClient] = None):
        self._client = client or ModelClient()

    async def assign(
        self,
        dates: List[_date],
        places: List[Place],
    ) -> List[List[PlaceId]]:
        payload = self._build_payload(dates, places)
        response = await self._client.generate(payload)
        assignments = self._parse_assignments(response.text, places)
        self._validate_assignments(assignments, len(dates), len(places))
        return assignments

    ##### Request/response handling ######

    @staticmethod
    def _build_payload(dates: List[_date], places: List[Place]) -> ModelRequest:
        """Construct model request payload with dates and places."""
        return ModelRequest(
            messages=[
                ModelMessage(role="system", content=ItineraryPrompt.instruction()),
                ModelMessage(role="user", content=ItineraryPrompt.body(dates, places)),
            ],
            response_type=ModelAssigner.RESPONSE_SCHEMA,
        )

    @classmethod
    def _parse_assignments(cls, text: str, places: List[Place]) -> List[List[PlaceId]]:
        """Parse model response text into place ID assignments."""
        try:
            data = cls._parse_json(text, cls.RESPONSE_SCHEMA)
            return [[places[idx].id for idx in day] for day in data["assignments"]]
        except IndexError:
            raise RuntimeError("Invalid assignment index value. Out of range.")

    @staticmethod
    def _validate_assignments(
        assignments: List[List[PlaceId]],
        expected_days: int,
        expected_places: int,
    ) -> None:
        """Validate assignment structure and completeness."""
        if len(assignments) != expected_days:
            raise RuntimeError("Invalid assignment day count")
        flat = [place_id for day in assignments for place_id in day]
        if len(flat) != expected_places:
            raise RuntimeError("Not all places were assigned")
        if len(set(flat)) != expected_places:
            raise RuntimeError("Duplicate place assignment")

    ##### Helpers #####

    @staticmethod
    def _parse_json(text: str, schema: dict) -> dict:
        """Extract JSON object from text input.
        Args:
            text (str): JSON data string. Supports Markdown code blocks.
            schema (dict): JSON schema for validation.
        Returns:
            dict: Parsed JSON object.
        Raises:
            RuntimeError: If parsing fails or schema validation fails.
        """
        # Handle possible markdown code block
        fenced = re.match(r"^\s*```(?:json)?\s*\n([\s\S]*?)\n```\s*$", text)
        content = fenced.group(1).strip() if fenced else text.strip()

        # Try parsing JSON
        try:
            data = json.loads(content)
            jsonschema.validate(instance=data, schema=schema)
        except json.JSONDecodeError as e:
            raise RuntimeError(f"Model response is not valid JSON: {e.msg}") from e
        except jsonschema.ValidationError as e:
            raise RuntimeError(f"Model response schema mismatch: {e.message}") from e

        # Verify JSON structure
        if not isinstance(data, dict):
            raise RuntimeError("Model response JSON is not an object")

        return data
