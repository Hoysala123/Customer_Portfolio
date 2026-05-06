using DotNetEnv;
using backend.Data;
using backend.Helpers;
using backend.Middleware;
using backend.Services;
using backend.Services.AuthService;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

Env.Load();
var builder = WebApplication.CreateBuilder(args);

// ======================================
// 1. DATABASE CONNECTION  ✅ REAL SQL SERVER
// ======================================
builder.Services.AddDbContext<FinVistaDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"))
);

// ======================================
// 2. CONTROLLERS
// ======================================
builder.Services.AddControllers();

// ======================================
// 2.1. SESSION SUPPORT
// ======================================
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(1);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
});

// ======================================
// 3. SWAGGER WITH JWT SUPPORT
// ======================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "FinVista API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter JWT token as: Bearer {your token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ======================================
// 4. JWT AUTHENTICATION
// ======================================
var jwtConfig = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
if (jwtConfig == null || string.IsNullOrEmpty(jwtConfig.Key))
{
    throw new InvalidOperationException("JWT settings are not configured properly.");
}
var keyBytes = Encoding.UTF8.GetBytes(jwtConfig.Key);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        RequireExpirationTime = true,
        ClockSkew = TimeSpan.Zero,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        RoleClaimType = System.Security.Claims.ClaimTypes.Role
    };
});

// ======================================
// 5. ROLE-BASED AUTHORIZATION
// ======================================
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CustomerOnly", policy => policy.RequireRole("Customer"));
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("AdvisorOnly", policy => policy.RequireRole("Advisor"));
});

// ======================================
// 6. DEPENDENCY INJECTION
// ======================================
builder.Services.AddScoped<CustomerAuthService>();
builder.Services.AddScoped<AdminAuthService>();
builder.Services.AddScoped<AdvisorAuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<PortfolioService>();
builder.Services.AddScoped<IPortfolioService, PortfolioService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<OtpService>();
builder.Services.AddScoped<ISessionAuditLogger, SessionAuditLogger>();

// Register AuthServiceFactory
builder.Services.AddScoped<AuthServiceFactory>();

// ======================================
// 7. CORS
// ======================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

// ======================================
// 8. BUILD APP
// ======================================
var app = builder.Build();

// ======================================
// 9. SWAGGER UI
// ======================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ======================================
// 10. CORS
// ======================================
app.UseCors("AllowAngular");

// ======================================
// 11. SESSION MIDDLEWARE
// ======================================
app.UseSession();

// ======================================
// 12. AUTH MIDDLEWARE
// ======================================
app.UseAuthentication();
app.UseAuthorization();

// ======================================
// 12. GLOBAL EXCEPTION HANDLING
// ======================================
app.UseExceptionMiddleware();

// ======================================
// 13. SEED DATABASE (Admin + Advisor)
// ======================================
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<FinVistaDbContext>();
    db.Database.EnsureCreated();
    DbInitializer.Initialize(db);
}

// ======================================
// 14. MAP CONTROLLERS
// ======================================
// 14. MAP CONTROLLERS
// ======================================
// Ensure AnalysisController is available (no extra registration needed for minimal APIs/controllers)
app.MapControllers();

// ======================================
// 15. RUN APPLICATION
// ======================================
app.Run();

public partial class Program { }