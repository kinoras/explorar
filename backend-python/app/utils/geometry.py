from functools import cache

from polyline import decode
from shapely.geometry import Point, Polygon
from google.maps.routing_v2 import Location


type Coordinate = tuple[float, float]  # (lat, lon)


def location_to_tuple(location: Location) -> Coordinate:
    """
    Convert a Location object to a (latitude, longitude) tuple.
    """
    return (location.lat_lng.latitude, location.lat_lng.longitude)


@cache
def decode_polyline(polyline: str) -> list[Coordinate]:
    """
    Decode an encoded polyline string into a list of (latitude, longitude) tuples with caching.
    """
    return decode(polyline)


def in_geofence(point: Coordinate, polyline: str) -> bool:
    """
    Check if a coordinate is inside or on the boundary of a polygon defined by an encoded polyline string.
    """
    coords = decode_polyline(polyline)

    # Invalid polygon
    if len(coords) < 3:
        return False

    # Shapely expects (lon, lat) tuples
    polygon = Polygon([(lon, lat) for lat, lon in coords])
    target = Point(point[1], point[0])

    return polygon.contains(target) or polygon.touches(target)
