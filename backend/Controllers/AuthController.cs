using backend.DTOs.Auth;
using backend.Data;
using backend.Helpers;
using backend.Models;
using backend.Services.AuthService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly FinVistaDbContext db;
        private readonly AuthServiceFactory authServiceFactory;

        public AuthController(
            FinVistaDbContext db,
            AuthServiceFactory authServiceFactory)
        {
            this.db = db;
            this.authServiceFactory = authServiceFactory;
        }

        // ======================================
        // CUSTOMER LOGIN (PUBLIC)
        // ======================================
        [AllowAnonymous]
        [HttpPost("customer/login")]
        public async Task<IActionResult> CustomerLogin(CustomerLoginRequest request)
        {
            var service = authServiceFactory.GetAuthService<CustomerLoginRequest>("Customer");
            var result = await service.LoginAsync(request);
            return Ok(result);
        }

        // ======================================
        // ADMIN LOGIN (PUBLIC)
        // ======================================
        [AllowAnonymous]
        [HttpPost("admin/login")]
        public async Task<IActionResult> AdminLogin(AdminLoginRequest request)
        {
            var service = authServiceFactory.GetAuthService<AdminLoginRequest>("Admin");
            var result = await service.LoginAsync(request);
            return Ok(result);
        }

        // ======================================
        // ADVISOR LOGIN (PUBLIC)
        // ======================================
        [AllowAnonymous]
        [HttpPost("advisor/login")]
        public async Task<IActionResult> AdvisorLogin(AdvisorLoginRequest request)
        {
            var service = authServiceFactory.GetAuthService<AdvisorLoginRequest>("Advisor");
            var result = await service.LoginAsync(request);
            return Ok(result);
        }

        // ======================================
        // CUSTOMER SIGNUP (PUBLIC)
        // ======================================
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            try
            {
                var exists = await db.Customers
                    .FirstOrDefaultAsync(c => c.Username == request.Username);

                if (exists != null)
                    return BadRequest(new { message = "Username already exists" });

                var advisorLoads = await db.Advisors
                    .Select(a => new
                    {
                        a.Id,
                        CustomerCount = db.Customers.Count(c => c.AdvisorId == a.Id)
                    })
                    .ToListAsync();

                var advisorId = advisorLoads
                    .OrderBy(a => a.CustomerCount)
                    .ThenBy(a => Random.Shared.Next())
                    .Select(a => a.Id)
                    .FirstOrDefault();

                var customer = new Customer
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name,
                    Username = request.Username,
                    Phone = request.Phone,
                    Email = request.Email,
                    PasswordHash = PasswordHasher.Hash(request.Password),
                    KycStatus = "NotSubmitted",
                    AdvisorId = advisorId == Guid.Empty ? null : advisorId
                };

                db.Customers.Add(customer);
                await db.SaveChangesAsync();

                return Ok(new { message = "Customer registered successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Registration failed: {ex.Message}" });
            }
        }

        // ======================================
        // VALIDATE SESSION (PROTECTED)
        // ======================================
        [Authorize]
        [HttpGet("validate-session")]
        public IActionResult ValidateSession()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var username = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(role))
            {
                return Unauthorized(new { message = "Invalid session" });
            }

            // Store session info (optional - for tracking)
            HttpContext.Session.SetString("UserId", userId);
            HttpContext.Session.SetString("Role", role);
            HttpContext.Session.SetString("LastActivity", DateTime.UtcNow.ToString());

            return Ok(new
            {
                isValid = true,
                userId = userId,
                role = role,
                username = username,
                sessionId = HttpContext.Session.Id,
                lastActivity = HttpContext.Session.GetString("LastActivity")
            });
        }

        // ======================================
        // LOGOUT (PROTECTED)
        // ======================================
        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Clear session data
            HttpContext.Session.Clear();
            
            return Ok(new { message = "Logged out successfully" });
        }
    }
}