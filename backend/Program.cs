using ExploreHKMOApi.Services;
using Google.Maps.Routing.V2;
using Google.Api.Gax.Grpc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<IPlaceMemory, JsonPlaceMemory>();
builder.Services.AddSingleton<RoutesClient>(sp =>
{
    var clientbuilder = new RoutesClientBuilder();
    return clientbuilder.Build();
});
builder.Services.AddSingleton<IRoutingService, GoogleRoutingService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "ExploreHKMO API");
        options.RoutePrefix = "docs"; 
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();