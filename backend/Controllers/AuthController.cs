using backend.DTOs.Auth;
using backend.Data;
using backend.Helpers;
using backend.Models;
using backend.Services.AuthService;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly FinVistaDbContext db;
        private readonly AuthServiceFactory authServiceFactory;
        private readonly ILogger<AuthController> logger;
        private readonly ISessionAuditLogger sessionAuditLogger;

        public AuthController(
            FinVistaDbContext db,
            AuthServiceFactory authServiceFactory,
            ILogger<AuthController> logger,
            ISessionAuditLogger sessionAuditLogger)
        {
            this.db = db;
            this.authServiceFactory = authServiceFactory;
            this.logger = logger;
            this.sessionAuditLogger = sessionAuditLogger;
        }

        // ======================================
        // CUSTOMER LOGIN (PUBLIC)
        // ======================================
        [AllowAnonymous]
        [HttpPost("customer/login")]
        public async Task<IActionResult> CustomerLogin(CustomerLoginRequest request)
        {
            var ipAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var userAgent = Request.Headers["User-Agent"].ToString() ?? "Unknown";
            
            logger.LogInfo($"POST /api/auth/customer/login called - Username: {request.Username}");
            try
            {
                var service = authServiceFactory.GetAuthService<CustomerLoginRequest>("Customer");
                var result = await service.LoginAsync(request);
                
                logger.LogInfo($"Customer login successful for username: {request.Username}");
                await sessionAuditLogger.LogLoginAsync(request.Username, "Customer", ipAddress, userAgent);
                logger.LogApiResponse("/api/auth/customer/login", "Success");
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErr(ex, $"Customer login failed for username: {request.Username}");
                await sessionAuditLogger.LogLoginFailureAsync(request.Username, ex.Message, ipAddress);
                return BadRequest(new { message = $"Login failed: {ex.Message}" });
            }
        }

        // ======================================
        // ADMIN LOGIN (PUBLIC)
        // ======================================
        [AllowAnonymous]
        [HttpPost("admin/login")]
        public async Task<IActionResult> AdminLogin(AdminLoginRequest request)
        {
            var ipAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var userAgent = Request.Headers["User-Agent"].ToString() ?? "Unknown";
            
            logger.LogInfo($"POST /api/auth/admin/login called - Username: {request.Username}");
            try
            {
                var service = authServiceFactory.GetAuthService<AdminLoginRequest>("Admin");
                var result = await service.LoginAsync(request);
                
                logger.LogInfo($"Admin login successful for username: {request.Username}");
                await sessionAuditLogger.LogLoginAsync(request.Username, "Admin", ipAddress, userAgent);
                logger.LogApiResponse("/api/auth/admin/login", "Success");
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErr(ex, $"Admin login failed for username: {request.Username}");
                await sessionAuditLogger.LogLoginFailureAsync(request.Username, ex.Message, ipAddress);
                return BadRequest(new { message = $"Login failed: {ex.Message}" });
            }
        }

        // ======================================
        // ADVISOR LOGIN (PUBLIC)
        // ======================================
        [AllowAnonymous]
        [HttpPost("advisor/login")]
        public async Task<IActionResult> AdvisorLogin(AdvisorLoginRequest request)
        {
            var ipAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";
            var userAgent = Request.Headers["User-Agent"].ToString() ?? "Unknown";
            
            logger.LogInfo($"POST /api/auth/advisor/login called - Username: {request.Username}");
            try
            {
                var service = authServiceFactory.GetAuthService<AdvisorLoginRequest>("Advisor");
                var result = await service.LoginAsync(request);
                
                logger.LogInfo($"Advisor login successful for username: {request.Username}");
                await sessionAuditLogger.LogLoginAsync(request.Username, "Advisor", ipAddress, userAgent);
                logger.LogApiResponse("/api/auth/advisor/login", "Success");
                
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErr(ex, $"Advisor login failed for username: {request.Username}");
                await sessionAuditLogger.LogLoginFailureAsync(request.Username, ex.Message, ipAddress);
                return BadRequest(new { message = $"Login failed: {ex.Message}" });
            }
        }

        // ======================================
        // CUSTOMER SIGNUP (PUBLIC)
        // ======================================
        /// <summary>
        /// Register a new customer account.
        /// </summary>
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            logger.LogInfo($"POST /api/auth/register called - Username: {request.Username}");
            try
            {
                var exists = await db.Customers
                    .FirstOrDefaultAsync(c => c.Username == request.Username);

                if (exists != null)
                {
                    logger.LogWarn($"Registration failed - Username already exists: {request.Username}");
                    return BadRequest(new { message = "Username already exists" });
                }

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

                logger.LogInfo($"Customer registered successfully - Username: {request.Username}, CustomerId: {customer.Id}");
                logger.LogApiResponse("/api/auth/register", "Success");
                return Ok(new { message = "Customer registered successfully" });
            }
            catch (Exception ex)
            {
                logger.LogErr(ex, $"Customer registration failed - Username: {request.Username}");
                return BadRequest(new { message = $"Registration failed: {ex.Message}" });
            }
        }

        // ======================================
        // LOGOUT (PROTECTED)
        // ======================================
        /// <summary>
        /// Logout the current user and invalidate their session.
        /// </summary>
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);
            var username = User.FindFirstValue(ClaimTypes.Name) ?? "Unknown";
            var ipAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";

            logger.LogInfo($"POST /api/auth/logout called by user: {userId} ({role})");

            try
            {
                // Log the logout event to file
                if (userId != null && role != null)
                {
                    await sessionAuditLogger.LogLogoutAsync(userId, username, role, ipAddress);
                }

                logger.LogInfo($"User {userId} ({role}) logged out successfully");
                return Ok(new { message = "Logout successful" });
            }
            catch (Exception ex)
            {
                logger.LogErr(ex, $"Logout failed for user: {userId}");
                return BadRequest(new { message = $"Logout failed: {ex.Message}" });
            }
        }

        // ======================================
        // LOGOUT ALL SESSIONS (PROTECTED)
        // ======================================
        /// <summary>
        /// Logout all sessions for the current user (logout from all devices).
        /// </summary>
        [Authorize]
        [HttpPost("logout-all")]
        public async Task<IActionResult> LogoutAll()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);
            var username = User.FindFirstValue(ClaimTypes.Name) ?? "Unknown";
            var ipAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString() ?? "Unknown";

            logger.LogInfo($"POST /api/auth/logout-all called by user: {userId} ({role})");

            try
            {
                // Log all logout event
                if (userId != null && role != null)
                {
                    await sessionAuditLogger.LogLogoutAsync(userId, username, role, ipAddress);
                }

                logger.LogInfo($"All sessions for user {userId} ({role}) have been terminated");
                return Ok(new { message = "All sessions have been logged out" });
            }
            catch (Exception ex)
            {
                logger.LogErr(ex, $"Logout all failed for user: {userId}");
                return BadRequest(new { message = $"Logout all failed: {ex.Message}" });
            }
        }
    }
}   
     