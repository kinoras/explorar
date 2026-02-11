import pytest
from datetime import date

from app.features.itinerary.assigner import ModelAssigner, RoundRobinAssigner


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
