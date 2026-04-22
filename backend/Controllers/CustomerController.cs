using backend.Data;
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

        public CustomerController(FinVistaDbContext db)
        {
            this.db = db;
        }

        // ⭐ UPDATED (but structure unchanged)
        [HttpGet("{id}")]
        public IActionResult GetCustomer(Guid id)
        {
            // Fetch logged-in user's ID from JWT
            var authenticatedUserId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            // Prevent accessing other users' data
            if (id != authenticatedUserId)
                return Forbid();

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
                return NotFound();

            return Ok(customer);
        }

        [HttpGet("kyc-status")]
    public IActionResult GetKycStatus()
    {
        var customerId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var customer = db.Customers.FirstOrDefault(c => c.Id == customerId);

        if (customer == null)
            return NotFound("Customer not found");

        return Ok(new { status = customer.KycStatus });
    }
    }
}