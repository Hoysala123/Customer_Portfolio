using backend.Data;
using backend.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/customer")]
    [Authorize(Policy = "CustomerOnly")]
    public class CustomerController : ControllerBase
    {
        private readonly FinVistaDbContext db;
        private readonly ILogger<CustomerController> logger;

        public CustomerController(FinVistaDbContext db, ILogger<CustomerController> logger)
        {
            this.db = db;
            this.logger = logger;
        }

        //  UPDATED (but structure unchanged)
        [HttpGet("{id}")]
        public IActionResult GetCustomer(Guid id)
        {
            // Fetch logged-in user's ID from JWT
            var authenticatedUserId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            logger.LogInfo($"GET /api/customer/{id} called by user: {authenticatedUserId}");

            // Prevent accessing other users' data
            if (id != authenticatedUserId)
            {
                logger.LogWarn($"Unauthorized access attempt - User {authenticatedUserId} tried to access customer {id}");
                return Forbid();
            }

            // Fetch customer
            var customer = db.Customers
                .Where(c => c.Id == authenticatedUserId)
                .Select(c => new 
                {
                    c.Id,
                    c.Name,
                    c.Email,
                    c.Phone,
                    c.Username,
                    c.KycStatus
                })
                .FirstOrDefault();

            if (customer == null)
            {
                logger.LogWarn($"Customer not found - CustomerId: {authenticatedUserId}");
                return NotFound();
            }

            logger.LogInfo($"Customer retrieved successfully - CustomerId: {authenticatedUserId}");
            return Ok(customer);
        }

        [HttpGet("kyc-status")]
        public IActionResult GetKycStatus()
        {
            var customerId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            logger.LogInfo($"GET /api/customer/kyc-status called by user: {customerId}");

            var customer = db.Customers.FirstOrDefault(c => c.Id == customerId);

            if (customer == null)
            {
                logger.LogWarn($"KYC Status check failed - Customer not found: {customerId}");
                return NotFound("Customer not found");
            }

            logger.LogInfo($"KYC Status retrieved - CustomerId: {customerId}, Status: {customer.KycStatus}");
            return Ok(new { status = customer.KycStatus });
        }
    }
}