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
        if (request.PlaceIds == null || request.PlaceIds.Count < 2)
        {
            return BadRequest("需要至少兩個地點");
        }

        var allPlaces = _placeMemory.GetAll();
        var placeMap = allPlaces.ToDictionary(p => p.Id);
        var orderedPlaces = new List<Models.Place>();
        foreach(var id in request.PlaceIds)
        {
            if (!placeMap.TryGetValue(id, out var place))
            {
                return BadRequest($"找不到地點 id={id}");
            }
            orderedPlaces.Add(place);
        }

        var result = await _routingService.ComputeDayRouteAsync(request, orderedPlaces, cancellationToken);
        return Ok(result);
    }
}