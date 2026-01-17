using System.Globalization;
using ExploreHKMOApi.Models;
using ExploreHKMOApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExploreHKMOApi.Controllers;

[ApiController]
[Route("routes")]
public class RoutesController : ControllerBase
{
    private readonly IPlaceMemory _placeMemory;
    private readonly IRoutingService _routingService;

    public RoutesController(IPlaceMemory placeMemory, IRoutingService routingService)
    {
        _placeMemory = placeMemory;
        _routingService = routingService;
    }

    [HttpPost("day")]
    public async Task<ActionResult<DayRouteResponse>> ComputeDayRoute(
        [FromBody] DayRouteRequest request,
        CancellationToken cancellationToken)
    {

        if (!DateTime.TryParseExact(request.Date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var requestDate))
        {
            return UnprocessableEntity(new
            {
                message = "Invalid date format"
            });
        }

        var hkTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Hong_Kong");
        var todayHk = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, hkTimeZone).Date;

        if (requestDate.Date < todayHk)
        {
            return UnprocessableEntity(
                new
                {
                    message = "Cannot search for past dates",
                    inputDate = request.Date,
                    today = todayHk.ToString("yyyy-MM-dd"),
                    timezone = "Asia/Hong_Kong",
                }
            );
        }

        if (request.PlaceIds == null || request.PlaceIds.Count < 2)
        {
            return UnprocessableEntity(new { message = "At least two places are required" });
        }
        

        var allPlaces = _placeMemory.GetAll();
        var placeMap = allPlaces.ToDictionary(p => p.Id);
        var orderedPlaces = new List<Models.Place>();
        foreach(var id in request.PlaceIds)
        {
            if (!placeMap.TryGetValue(id, out var place))
            {
                return UnprocessableEntity(new { message = "Place not found", id });
            }
            orderedPlaces.Add(place);
        }
        
        var firstRegion = orderedPlaces[0].Region;
        var allSameRegion = orderedPlaces.All(p => string.Equals(p.Region, firstRegion, StringComparison.OrdinalIgnoreCase));
        if (!allSameRegion)
        {
            return UnprocessableEntity(new
            {
                message = "All places must be in the same region",
                regions = orderedPlaces.Select(p => new {p.Id, p.Region})
            });
        }

        var result = await _routingService.ComputeDayRouteAsync(request, orderedPlaces, cancellationToken);
        return Ok(result);
    }
}