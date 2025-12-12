using System.Text.Json.Serialization;

namespace ExploreHKMOApi.Models;

public class Place
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Region { get; set; }
    public required string Category { get; set; }
    public Description Description { get; set; } = default!;

    public Location Location { get; set; } = null!;
    public Hours? Hours { get; set; }
    public required List<string> Images { get; set; } = new ();

    public double? Rating { get; set; }
    public int? Ranking { get; set; }
    public string? Phone { get; set; }
    public string? Website { get; set; }

    [JsonPropertyName("_connection")]
    public Connection? Connection { get; set; }
}

public class Description
{
    public string Content { get; set; } = "";
    public string Source { get; set; } = "tripadvisor"; //tripadvisor|google-map|ai
}

public class Hours
{
    public string Timezone { get; set; } = "Asia/Hong_Kong";
    public List<RegularHour> Regular { get; set; } = new();
    public List<HourException>? Exceptions { get; set; }
}

public class RegularHour
{
    public int Day { get; set; }       // 1–7 Monday to Sunday
    public string Open { get; set; } = "";
    public string Close { get; set; } = "";
}

public class HourException
{
    public string Date { get; set; } = ""; // "YYYY-MM-DD"
    public bool? Closed { get; set; }
    public string? Open { get; set; }
    public string? Close { get; set; }
    public string? Notes { get; set; }
}

public class Location
{
    public string Address { get; set; } = "";
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

public class Connection
{
    public string Type { get; set; } = "tripadvisor";
    public int LocationId { get; set; }
}