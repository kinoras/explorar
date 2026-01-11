using ExploreHKMOApi.Models;
using ExploreHKMOApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace ExploreHKMOApi.Controllers;

[ApiController]
[Route("places")]
public class PlacesController : ControllerBase
{
    private readonly IPlaceMemory _memory;

    public PlacesController(IPlaceMemory memory)
    {
        _memory = memory;
    }

    //GET /places?region=hk&categories=entertainment&orderBy=ranking&orderDir=asc&limit=10&cursor=13
    [HttpGet]
    public ActionResult<IEnumerable<Place>> GetList(
        [FromQuery] string? region,
        [FromQuery] string? categories,
        [FromQuery] string? orderBy,
        [FromQuery] string? orderDir,
        [FromQuery] int? limit,
        [FromQuery] int? cursor)
    {
        var pageSize = limit?? 10;
        if (pageSize <= 0) pageSize = 10;
        if (pageSize > 50) pageSize = 50;

        IEnumerable<Place> items = _memory.GetAll();

        if (!string.IsNullOrEmpty(region))
        {
            var normalized = NormalizeRegion(region);
            items = items.Where(p => p.Region.Equals(normalized, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrEmpty(categories))
        {
            var set = categories.Split(',', StringSplitOptions.RemoveEmptyEntries)
                                .Select(c => c.Trim().ToLower())
                                .ToHashSet();
            items = items.Where(p => set.Contains(p.Category.ToLower()));
        }

        var dir = (orderDir?? "asc").ToLower();
        var key = (orderBy?? "id"). ToLower();

        items = key switch
        {
            "rating" => ApplyOrder(items, p => p.Rating ?? 0, dir).ThenBy(p => p.Id),
            "name" => ApplyOrder(items, p => p.Name, dir).ThenBy(p => p.Id),
            "ranking" => ApplyOrder(items, p => p.Ranking ?? int.MaxValue, dir).ThenBy(p => p.Id),
            _ => ApplyOrder(items, p => p.Id, dir)
        };

        var orderedList = items.ToList();

        // cursor paging
        int startIndex = 0;
        if (cursor.HasValue)
        {
            var idx = orderedList.FindIndex(p => p.Id == cursor.Value);
            if (idx < 0)
            {
                return UnprocessableEntity(new
                {
                    message = "Invalid cursor. The cursor ID was not found in the filtered/sorted result.",
                    cursor = cursor.Value,
                    region,
                    categories,
                    orderBy = key,
                    orderDir = dir
                });
            }
            startIndex = idx;
        }

        var pagePlusOne = orderedList.Skip(startIndex).Take(pageSize + 1).ToList();
        int? nextCursor = null;
        if (pagePlusOne.Count > pageSize)
        {
            nextCursor = pagePlusOne[pageSize].Id;
            pagePlusOne = pagePlusOne.Take(pageSize).ToList();
        }
        
        return Ok(new
        {
            places = pagePlusOne,
            nextCursor
        });
    }

    [HttpGet("{id:int}")]
    public ActionResult<Place> GetById(int id)
    {
        var place = _memory.GetById(id);
        if (place is null) return NotFound();
        return Ok(place);
    }

    private static IOrderedEnumerable<T> ApplyOrder<T, TKey>(
        IEnumerable<T> src,
        Func<T, TKey> keySelector,
        string? orderDir)
    {
        return (orderDir?? "asc").ToLower() == "desc"
            ? src.OrderByDescending(keySelector) : src.OrderBy(keySelector);
    }

    private static string NormalizeRegion(string regionParam)
    => regionParam.ToLower() switch
    {
        "hk" => "hong-kong",
        "hong kong" => "hong-kong",
        "mo" => "macau",
        "macau" => "macau",
        _ => regionParam.ToLower()
    };
}