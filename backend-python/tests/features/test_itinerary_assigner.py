import pytest
from datetime import date
from unittest.mock import AsyncMock

from app.features.itinerary.assigner import ModelAssigner, RoundRobinAssigner
from app.integrations.model.contracts import ModelResponse


##### Helpers #####


class DummyClient:
    def __init__(self, responses):
        self.generate = AsyncMock(side_effect=responses)


##### ModelAssigner #####


def test_build_payload(test_places):
    payload = ModelAssigner._build_payload(dates=[], places=test_places[:2])
    assert payload.messages[0].role == "system"
    assert payload.messages[1].role == "user"
    assert payload.response_type == ModelAssigner.RESPONSE_SCHEMA


def test_parse_json():
    text = '```json\n{"assignments": [[0, 1]]}\n```'
    schema = ModelAssigner.RESPONSE_SCHEMA

    # Valid case
    data = ModelAssigner._parse_json(text, schema)
    assert data == {"assignments": [[0, 1]]}

    # Invalid cases
    with pytest.raises(RuntimeError, match="not valid JSON"):
        ModelAssigner._parse_json('{"assignments": [[0, 1]]', schema)
    with pytest.raises(RuntimeError, match="schema mismatch"):
        ModelAssigner._parse_json('{"foo": [[0, 1]]}', schema)


def test_parse_assignments(test_places):
    places = test_places[:3]
    text = '{"assignments": [[0, 2], [1]]}'

    # Valid case
    assignments = ModelAssigner._parse_assignments(text, places)
    assert assignments == [[places[0].id, places[2].id], [places[1].id]]

    # Invalid cases
    with pytest.raises(RuntimeError, match="Out of range"):
        ModelAssigner._parse_assignments('{"assignments": [[0, 3]]}', places)


def test_validate_assignments():
    # Valid case
    ModelAssigner._validate_assignments([["place-1"], ["place-2"]], 2, 2)

    # Invalid cases
    with pytest.raises(RuntimeError, match="Invalid assignment day count"):
        ModelAssigner._validate_assignments([["place-1"]], 2, 1)
    with pytest.raises(RuntimeError, match="Not all places were assigned"):
        ModelAssigner._validate_assignments([["place-1"], []], 2, 2)
    with pytest.raises(RuntimeError, match="Duplicate place assignment"):
        ModelAssigner._validate_assignments([["place-1"], ["place-1"]], 2, 2)


def test_round_robin_assign(test_places):
    dates = [date(2026, 1, 1), date(2026, 1, 2)]
    places = test_places[:4]

    assignments = RoundRobinAssigner.assign(dates=dates, places=places)
    assert assignments == [[places[0].id, places[2].id], [places[1].id, places[3].id]]


@pytest.mark.asyncio
async def test_assign_retries(test_places):
    # Prepare
    dates = [date(2026, 1, 1), date(2026, 1, 2)]
    places = test_places[:2]

    # Dummy responses
    success_response = ModelResponse(text='{"assignments": [[0], [1]]}', raw={})
    error_response = ModelResponse(text='{"assignments": [[0], [0]]}', raw={})

    # Test: retries then succeeds
    success_client = DummyClient(responses=[error_response, success_response])
    success_assigner = ModelAssigner(client=success_client)
    success_result = await success_assigner.assign(dates=dates, places=places)
    assert success_result == [[places[0].id], [places[1].id]]
    assert success_client.generate.await_count == 2

    # Test: retries exhausted then fails with last error
    failed_client = DummyClient(responses=[error_response] * 3)
    failed_assigner = ModelAssigner(client=failed_client)
    with pytest.raises(RuntimeError, match="Duplicate place assignment"):
        await failed_assigner.assign(dates=dates, places=places)
    assert failed_client.generate.await_count == 3
