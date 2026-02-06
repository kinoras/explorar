import pytest
from types import SimpleNamespace
from google.maps.routing_v2 import TransitVehicle

from app.integrations.fares import macau as macau_module


##### Constants #####


WALK = None  # No vehicle type for walking
BUS = TransitVehicle.TransitVehicleType.BUS
TRAM = TransitVehicle.TransitVehicleType.TRAM


##### Helper Unit #####


def test_compare_station_names():
    assert macau_module._compare_station_names("Jogos da Ásia", "Jogos Da Ásia")
    assert macau_module._compare_station_names("Lótus", "Posto Fronteiriço de Lótus")
    assert not macau_module._compare_station_names("Cotai Oeste", "Cotai Leste")


def test_get_station_key():
    assert macau_module._get_station_key("Barra") != -1
    assert macau_module._get_station_key("媽閣") != -1  # Chinese
    assert macau_module._get_station_key("ESTÁDIO") != -1  # Uppercase + accents
    assert macau_module._get_station_key("Universidade de Macau") == -1  # Invalid


##### Estimator Integration #####


class DummyDataFactory:
    @staticmethod
    def location(lat, lng):
        return SimpleNamespace(lat_lng=SimpleNamespace(latitude=lat, longitude=lng))

    @classmethod
    def drive_leg(cls, origin, destination, distance, duration):
        return SimpleNamespace(
            start_location=cls.location(lat=origin[0], lng=origin[1]),
            end_location=cls.location(lat=destination[0], lng=destination[1]),
            distance_meters=distance,
            duration=SimpleNamespace(seconds=duration),
        )

    @classmethod
    def transit_step(cls, vehicle, stops=0, origin=None, destination=None):
        return SimpleNamespace(
            transit_details=SimpleNamespace(
                transit_line=SimpleNamespace(vehicle=SimpleNamespace(type_=vehicle)),
                stop_count=stops,
                stop_details=SimpleNamespace(
                    departure_stop=SimpleNamespace(name=origin),
                    arrival_stop=SimpleNamespace(name=destination),
                ),
            )
        )


@pytest.mark.parametrize(
    ("origin", "destination", "distance", "duration", "expected"),
    [
        ((22.128, 113.5464), (22.130, 113.5632), 3355, 569, 58),  # U.M. -> Seac Pai Van
        ((22.158, 113.5743), (22.117, 113.5514), 6101, 701, 87),  # Aeroporto -> Coloane
        ((22.201, 113.5745), (22.180, 113.5378), 9098, 1067, 119),  # Ponte HZM -> Torre
        ((22.215, 113.5493), (22.119, 113.5693), 15220, 1439, 170),  # P.Cerco -> Hac-Sa
    ],
)
def test_compute_taxi(origin, destination, distance, duration, expected):
    leg = DummyDataFactory.drive_leg(origin, destination, distance, duration)
    assert macau_module.MacauTaxiFareEstimator.compute(leg) == expected


@pytest.mark.parametrize(
    ("steps", "expected"),  # step = (vehicle, stops?, origin?, destination?)
    [
        ([(WALK,)], 0),  # Walking only
        ([(WALK,), (BUS,), (BUS,), (WALK,)], 12),  # Multiple bus rides
        ([(WALK,), (BUS,), (WALK,), (TRAM, 4, "Barra", "Estádio"), (WALK,)], 14),
        # LRT-only: P.F.Hengqin -> Seac Pai Van (Flaw data directly from Google)
        (
            [
                (TRAM, 2, "Hengqin", "Posto Fronteiriço de Lótus"),
                (TRAM, 2, "Posto Fronteiriço de Lótus", "Hospital Union"),
                (TRAM, 2, "Hospital Union", "Est. Seak Pai Van / Praia Park"),
            ],
            8,
        ),
    ],
)
def test_compute_transit(steps, expected):
    leg = SimpleNamespace(steps=[DummyDataFactory.transit_step(*s) for s in steps])
    assert macau_module.MacauTransitFareEstimator.compute(leg) == expected
