namespace ExploreHKMOApi.Models;

public record DayRouteRequest(
    string Date,          // "YYYY-MM-DD"
    string Mode,          // "driving" | "walking" | "transit"
    List<int> PlaceIds    // 例如 [地點1, 地點2, 地點3 ...]
);

public record RouteLegDto(
    int FromPlaceId,
    int ToPlaceId,
    int Distance,
    int Duration,
    string TravelMode,
    List<RouteStepDto> Steps
);

public record RouteStepDto(
    string StepTravelMode, // "WALK", "TRANSIT"
    int? Distance,
    int? Duration,
    string? Instruction,
    TransitStepDto? Transit  // this value only exists for TRANSIT mode
);

public record TransitStepDto(
    string? LineName,
    string? VehicleType,
    string? DepartureStopName,
    string? ArrivalStopName,
    int? StopCount
);

public record DayRouteResponse(
    string Date,
    string Mode,
    List<RouteLegDto> Legs,
    int TotalDistance,
    int TotalDuration
);
