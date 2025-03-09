using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using starmovie.Data;
using starmovie.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Cấu hình DbContext
builder.Services.AddDbContext<MovieContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// Cấu hình Identity
builder.Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddEntityFrameworkStores<MovieContext>()
    .AddDefaultTokenProviders();

// Tuỳ chỉnh Identity Options (Không bắt buộc, nếu cần đơn giản hóa mật khẩu)
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
});

builder.Services.AddAuthorization();

builder.Services.AddAutoMapper(typeof(Program));


// Đăng kí IBook
builder.Services.AddScoped<IBookRepository, BookRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Thêm Authentication Middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapIdentityApi<IdentityUser>();

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
