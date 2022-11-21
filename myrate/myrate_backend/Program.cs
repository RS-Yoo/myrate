using myrate_backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNet.Identity;
using myrate_backend.Areas.Data;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<MyRateDbContext>(options =>
       options.UseSqlServer(connectionString));
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

//builder.Services.AddDatabaseDeveloperPageExceptionFilter();


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

//builder.Services.AddDatabaseDeveloperPageExceptionFilter();
// Configure the HTTP request pipeline.
using (var scope = app.Services.CreateScope())
{
    var DB = scope.ServiceProvider.GetRequiredService<MyRateDbContext>();

    await DB.SeedData();
    //var um = scope.ServiceProvider.GetRequiredService<Microsoft.AspNetCore.Identity.UserManager<MyRateUser>>();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
