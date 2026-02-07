import pytest
from datetime import datetime, date, time
from types import SimpleNamespace
from google.maps.routing_v2 import RouteTravelMode, TransitVehicle

from app.core.config import settings
from app.features.routing.schemas import DriveRoute, TravelMode, Vehicle
from app.features.routing.service import RouteService, Segment


@pytest.mark.parametrize(
    ("num", "expected"),
    [
        (3, ["2026-01-01 10:00:00", "2026-01-01 11:00:00", "2026-01-01 12:00:00"]),
        (2, ["2026-01-01 10:00:00", "2026-01-01 12:00:00"]),
        (1, ["2026-01-01 11:00:00"]),
    ],
)
def test_linspace_datetime(num, expected):
    def _parse_datetime(dt: str) -> datetime:
        return datetime.strptime(dt, "%Y-%m-%d %H:%M:%S")

    start = _parse_datetime("2026-01-01 10:00:00")
    stop = _parse_datetime("2026-01-01 12:00:00")
    result = RouteService.linspace_datetime(start, stop, num)

    # Verify correctness
    assert result == [_parse_datetime(dt) for dt in expected]


def test_shift_datetime_to_future():
    past = datetime(2026, 1, 1, 12, 0, 0, tzinfo=settings.TIMEZONE)
    future = RouteService.shift_datetime_to_future(past)

    # Verify effectiveness
    now = datetime.now(tz=settings.TIMEZONE)
    assert future >= now

    # Verify step size
    diff = future - past
    assert diff.days % 7 == 0


def test_create_segments(test_places):
    base_date = date(2026, 1, 2)
    start = datetime.combine(base_date, time(9, 0), tzinfo=settings.TIMEZONE)
    stop = datetime.combine(base_date, time(18, 0), tzinfo=settings.TIMEZONE)
    now = datetime.now(tz=settings.TIMEZONE)

    # Verify transit mode
    places = test_places[:3]  # 3 places
    segments = RouteService.create_segments(places, base_date, TravelMode.TRANSIT)
    expected_departure = RouteService.linspace_datetime(start, stop, len(segments))

    assert len(segments) == 2
    assert segments[0].places == [places[0], places[1]]
    assert segments[1].places == [places[1], places[2]]
    assert segments[0].departure == expected_departure[0]
    assert segments[1].departure == expected_departure[1]

    # Verify drive mode
    places = test_places + [test_places[0]]  # 11 places
    segments = RouteService.create_segments(places, base_date, TravelMode.DRIVE)

    assert len(segments) == 2
    assert segments[0].places == places[:10]
    assert segments[1].places == places[9:]
    assert all(s.departure >= now for s in segments)


@pytest.mark.parametrize(
    ("steps", "expected"),  # step = list[vehicle_type]
    [
        (["BUS"], Vehicle.BUS),
        (["SUBWAY"], Vehicle.METRO),
        (["TRAM"], Vehicle.TRAM),
        (["FERRY"], Vehicle.FERRY),
        ([], None),  # Empty steps
        (["WALK"], None),  # Non-transit step only
        (["CABLE_CAR"], None),  # Unsupported vehicle
        (["BUS", "TRAM"], Vehicle.MIXED),  # Mixed vehicles
    ],
)
def test_extract_vehicle_mapping(steps, expected):
    # Helper to build a step with given vehicle type
    def _build_step(type):
        if type == "WALK":
            mode = RouteTravelMode.WALK
            type_ = TransitVehicle.TransitVehicleType.TRANSIT_VEHICLE_TYPE_UNSPECIFIED
        else:
            mode = RouteTravelMode.TRANSIT
            type_ = TransitVehicle.TransitVehicleType[type]
        return SimpleNamespace(
            travel_mode=mode,
            transit_details=SimpleNamespace(
                transit_line=SimpleNamespace(vehicle=SimpleNamespace(type_=type_))
            ),
        )

    # Verify correctness
    assert RouteService.extract_vehicle([_build_step(s) for s in steps]) == expected


@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("step_modes", "expected_mode"),
    [
        ([RouteTravelMode.WALK, RouteTravelMode.DRIVE], TravelMode.DRIVE),  # Mixed
        ([RouteTravelMode.WALK, RouteTravelMode.WALK], TravelMode.WALK),  # Uniform
    ],
)
async def test_compute_segment(monkeypatch, test_places, step_modes, expected_mode):
    # Mock: RoutesAsyncClient.compute_routes
    class FakeClient:
        async def compute_routes(self, request, metadata):
            legs = [
                SimpleNamespace(
                    distance_meters=100 * (idx + 1),
                    duration=SimpleNamespace(seconds=10),
                    polyline=SimpleNamespace(encoded_polyline="poly"),
                    steps=[SimpleNamespace(travel_mode=mode) for mode in step_modes],
                )
                for idx in range(len(request.intermediates) + 1)
            ]
            return SimpleNamespace(routes=[SimpleNamespace(legs=legs)])

    monkeypatch.setattr(
        "app.features.routing.service.routing_v2.RoutesAsyncClient",
        lambda client_options: FakeClient(),
    )

    # Run test
    routes = await RouteService.compute_segment(
        segment=Segment(
            places=test_places[:3],
            mode=TravelMode.DRIVE,
            departure=datetime(2026, 1, 2, 9, 0, tzinfo=settings.TIMEZONE),
        )
    )

    assert len(routes) == 2
    assert routes[1].mode == expected_mode  # Mode overriding
    assert routes[1].distance == 200  # Correctness


@pytest.mark.asyncio
async def test_compute(monkeypatch, test_places):
    # Mock: RouteService.compute_segment
    async def fake_compute_segment(segment: Segment):
        return [
            DriveRoute(
                origin=segment.places[idx].id,
                destination=segment.places[idx + 1].id,
                distance=100 + idx,
                duration=10 + idx,
                polyline=f"abc{idx}",
            )
            for idx in range(len(segment.places) - 1)
        ]

    monkeypatch.setattr(RouteService, "compute_segment", fake_compute_segment)

    # Run test
    places = test_places[:3]
    routes = await RouteService.compute(places, date(2026, 1, 2), TravelMode.DRIVE)

    assert len(routes) == 2
    assert routes[0].origin == places[0].id
    assert routes[0].destination == places[1].id
    assert routes[1].origin == places[1].id
    assert routes[1].destination == places[2].id
