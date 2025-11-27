using ExploreHKMOApi.Models;

namespace ExploreHKMOApi.Services;

public interface IRoutingService
{
    Task<DayRouteResponse> ComputeDayRouteAsync(
        DayRouteRequest request,
        IReadOnlyList<Place> places,
        CancellationToken cancellationToken = default);
}