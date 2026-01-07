using ExploreHKMOApi.Services;
using Google.Maps.Routing.V2;
using Google.Api.Gax.Grpc;

var builder = WebApplication.CreateBuilder(args);
var googleCredentialsJson = builder.Configuration["GOOGLE_CREDENTIALS_JSON"];
if (!string.IsNullOrWhiteSpace(googleCredentialsJson) && string.IsNullOrEmpty(Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS")))
{
    var filePath = Path.Combine(AppContext.BaseDirectory, "google-sa.json");
    if (!File.Exists(filePath))
        File.WriteAllText(filePath, googleCredentialsJson);
    
    Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", filePath);
}

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultCorsPolicy", policy =>
    {
        if (allowedOrigins is { Length: > 0})
        {
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
        }
    });
});
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SupportNonNullableReferenceTypes();
});
builder.Services.AddSingleton<IPlaceMemory, JsonPlaceMemory>();
builder.Services.AddSingleton<RoutesClient>(sp =>
{
    var clientbuilder = new RoutesClientBuilder();
    return clientbuilder.Build();
});
builder.Services.AddSingleton<IRoutingService, GoogleRoutingService>();

var app = builder.Build();

app.UseCors("DefaultCorsPolicy");
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.RoutePrefix = "docs";
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "ExploreHKMO API");
});


app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();