using backend.Data;
using backend.DTOs.Kyc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/admin/kyc")]
    [Produces("application/json")]
    // [Authorize(Policy = "AdminOnly")] // Temporarily commented out for testing
    public class AdminKycController : ControllerBase
    {
        private readonly FinVistaDbContext db;

        public AdminKycController(FinVistaDbContext db)
        {
            this.db = db;
        }

        // GET: /api/admin/kyc/requests
        [HttpGet("requests")]
        public async Task<IActionResult> GetKycRequests()
        {
            var list = await db.KycRequests
                .Where(k => k.Status == "Pending")
                .Select(k => new KycResponseDto
                {
                    Id = k.Id,
                    CustomerName = k.Name,
                    Phone = k.Phone,
                    Email = k.Email,
                    Status = k.Status
                })
                .ToListAsync();

            return Ok(list);
        }

        // DEBUG: Test endpoint
        [HttpPost("test-approve")]
        public IActionResult TestApprove()
        {
            var response = new KycActionResponseDto { Success = true, Message = "Test approve response" };
            return Ok(response);
        }

        // POST: /api/admin/kyc/{id}/approve
        [HttpPost("{id}/approve")]
        public async Task<IActionResult> Approve(Guid id)
        {
            try
            {
                var req = await db.KycRequests.FindAsync(id);
                if (req == null)
                {
                    return NotFound(new KycActionResponseDto(false, "KYC request not found"));
                }

                req.Status = "Approved";

                // UPDATE CUSTOMER KYC STATUS TOO
                var customer = await db.Customers.FindAsync(req.CustomerId);
                if (customer != null)
                {
                    customer.KycStatus = "Approved";
                }

                await db.SaveChangesAsync();

                return Ok(new KycActionResponseDto(true, "KYC Approved successfully"));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error approving KYC: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new KycActionResponseDto(false, $"Server error: {ex.Message}"));
            }
        }

        // POST: /api/admin/kyc/{id}/decline
        [HttpPost("{id}/decline")]
        public async Task<IActionResult> Decline(Guid id)
        {
            try
            {
                var req = await db.KycRequests.FindAsync(id);
                if (req == null)
                {
                    return NotFound(new KycActionResponseDto(false, "KYC request not found"));
                }

                req.Status = "Declined";

                // UPDATE CUSTOMER KYC STATUS TOO
                var customer = await db.Customers.FindAsync(req.CustomerId);
                if (customer != null)
                {
                    customer.KycStatus = "Declined";
                }

                await db.SaveChangesAsync();

                return Ok(new KycActionResponseDto(true, "KYC Declined successfully"));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error declining KYC: {ex.Message}\n{ex.StackTrace}");
                return StatusCode(500, new KycActionResponseDto(false, $"Server error: {ex.Message}"));
            }
        }
    }
}