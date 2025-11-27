using ExploreHKMOApi.Models;
using Google.Api.Gax.Grpc;
using Google.Maps.Routing.V2;
using Google.Protobuf.WellKnownTypes;
using Google.Type;

namespace ExploreHKMOApi.Services;

public class GoogleRoutingService : IRoutingService
{
    private readonly RoutesClient _routesClient;
    public GoogleRoutingService(RoutesClient routesClient)
    {
        _routesClient = routesClient;
    }

    public async Task<DayRouteResponse> ComputeDayRouteAsync(
        DayRouteRequest request,
        IReadOnlyList<Place> places,
        CancellationToken cancellationToken = default)
    {
        if (places.Count < 2)
        {
            throw new ArgumentException("At least 2 places are required.");
        }

        if (!System.DateTime.TryParse(request.Date, out var localDate))
        {
            throw new ArgumentException("Invalid date format, it must be YYYY-MM-DD");
        }

        var departureLocal = new System.DateTime(localDate.Year, localDate.Month, localDate.Day, 9, 0, 0, DateTimeKind.Unspecified);
        var hkTimeZone = TimeZoneInfo.FindSystemTimeZoneById("China Standard Time");
        var departureUtc = TimeZoneInfo.ConvertTimeToUtc(departureLocal, hkTimeZone);
        var departureTimestamp = Timestamp.FromDateTime(departureUtc);

        var travelMode = MapTravelMode(request.Mode);

        var legs = new List<RouteLegDto>();
        int totalDistance = 0;
        int totalDuration = 0;

        for (int i = 0; i < places.Count - 1; i++)
        {
            var originPlace = places[i];
            var destPlace = places[i+1];

            var origin = new Waypoint
            {
                Location = new Google.Maps.Routing.V2.Location
                {
                    LatLng = new LatLng
                    {
                        Latitude = originPlace.Location.Latitude,
                        Longitude = originPlace.Location.Longitude
                    }
                }
            };

            var dest = new Waypoint
            {
                Location = new Google.Maps.Routing.V2.Location
                {
                    LatLng = new LatLng
                    {
                        Latitude = destPlace.Location.Latitude,
                        Longitude = destPlace.Location.Longitude
                    }
                }
            };

            var computeRequest = new ComputeRoutesRequest
            {
                Origin = origin,
                Destination = dest,
                TravelMode = travelMode,
                DepartureTime = departureTimestamp,
                LanguageCode = "zh-TW",
                ComputeAlternativeRoutes = false
            };
            
            var fieldMask = "routes.distanceMeters," +
                            "routes.duration," +
                            "routes.legs.steps.travelMode," +
                            "routes.legs.steps.distanceMeters," +
                            "routes.legs.steps.staticDuration," +
                            "routes.legs.steps.transitDetails";
            var callSettings = CallSettings.FromHeader("X-Goog-FieldMask",fieldMask);
            
            var response = await _routesClient.ComputeRoutesAsync(
                computeRequest,
                callSettings);
            
            var route = response.Routes.FirstOrDefault();
            if (route == null)
            {
                continue;
            }
            var distanceMeters = route.DistanceMeters;
            int durationSeconds = 0;
            if (route.Duration != null)
                durationSeconds = (int)(route.Duration.Seconds);

            totalDistance += distanceMeters;
            totalDuration += durationSeconds;
            var stepsDto = new List<RouteStepDto>();
            var leg = route.Legs.FirstOrDefault();
            if (leg != null && leg.Steps != null)
            {
                foreach(var step in leg.Steps)
                {
                    var stepMode = step.TravelMode.ToString();
                    int? stepDistance = step.DistanceMeters;
                    int? stepDuration = (int?)(step.StaticDuration?.Seconds ?? 0);
                    
                    TransitStepDto? transitDto = null;
                    if (step.TravelMode == RouteTravelMode.Transit && step.TransitDetails != null)
                    {
                        var t = step.TransitDetails;
                        var departureStopName = t.StopDetails?.DepartureStop?.Name;
                        var arrivalStopName = t.StopDetails?.ArrivalStop?.Name;
                        var lineName = t.TransitLine?.Name;
                        var vehicleType = t.TransitLine?.Vehicle?.Type.ToString();
                        var stopCount = t.StopCount;

                        transitDto = new TransitStepDto(
                            LineName: lineName,
                            VehicleType: vehicleType,
                            DepartureStopName: departureStopName,
                            ArrivalStopName: arrivalStopName,
                            StopCount: stopCount == 0 ? null : stopCount
                        );
                    }

                    stepsDto.Add(new RouteStepDto(
                        StepTravelMode: stepMode,
                        Distance: stepDistance,
                        Duration: stepDuration,
                        Instruction: null,
                        Transit: transitDto
                    ));
                }
                stepsDto = MergeWalkSteps(stepsDto);
            }

            legs.Add(new RouteLegDto(
                FromPlaceId: originPlace.Id,
                ToPlaceId: destPlace.Id,
                Distance: distanceMeters,
                Duration: durationSeconds,
                TravelMode: travelMode.ToString(),
                Steps: stepsDto
            ));

            departureTimestamp = departureTimestamp + Duration.FromTimeSpan(TimeSpan.FromSeconds(durationSeconds + 10800));
        }

        return new DayRouteResponse(
            Date: request.Date,
            Mode: request.Mode,
            Legs: legs,
            TotalDistance: totalDistance,
            TotalDuration: totalDuration
        );
    }

    private static List<RouteStepDto> MergeWalkSteps(List<RouteStepDto> rawPath)
    {
        if (rawPath.Count == 0) return rawPath;

        var merged  = new List<RouteStepDto>();
        RouteStepDto? currentWalkStep = null;

        foreach(var step in rawPath)
        {
            if (!string.Equals(step.StepTravelMode, "Walk", StringComparison.OrdinalIgnoreCase))
            {
                if (currentWalkStep != null)
                {
                    merged.Add(currentWalkStep);
                    currentWalkStep = null;
                }
                merged.Add(step);
                continue;
            }

            if (currentWalkStep == null)
            {
                currentWalkStep = new RouteStepDto(
                    StepTravelMode: step.StepTravelMode,
                    Distance: step.Distance ?? 0,
                    Duration: step.Duration ?? 0,
                    Instruction: step.Instruction,
                    Transit: null
                );
            }
            else
            {
                currentWalkStep = currentWalkStep with
                {
                    Distance = (currentWalkStep.Distance ?? 0) + (step.Distance ?? 0),
                    Duration = (currentWalkStep.Duration ?? 0) + (step.Duration ?? 0)
                };
            }
        }

        if (currentWalkStep != null)
            merged.Add(currentWalkStep);
        
        return merged;
    }
    
    private static RouteTravelMode MapTravelMode(string mode) =>
    mode.ToLower() switch
    {
        "walking" => RouteTravelMode.Walk,
        "taxi" => RouteTravelMode.Drive,
        "driving" => RouteTravelMode.Drive,
        "transit" => RouteTravelMode.Transit,
        _ => RouteTravelMode.Transit
    };
}