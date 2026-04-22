using backend.Data;
using backend.DTOs.Kyc;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "CustomerOnly")]
    public class KycController : ControllerBase
    {
        private readonly FinVistaDbContext db;
        private readonly OtpService otpService;

        public KycController(FinVistaDbContext db, OtpService otpService)
        {
            this.db = db;
            this.otpService = otpService;
        }

        // STEP 1 — Submit KYC
        [HttpPost("submit")]
        public async Task<IActionResult> Submit([FromBody] KycSubmitDto dto)
        {
            if (!IsValidEmail(dto.Email))
            {
                return BadRequest(new { message = "Please submit a valid email address." });
            }

            var customerId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var req = new KycRequest
            {
                Id = Guid.NewGuid(),
                CustomerId = customerId,
                Name = dto.Name,
                Phone = dto.Phone,
                Email = dto.Email,
                Status = "Pending"
            };

            db.KycRequests.Add(req);

            // Update Customer KYC Status
            var customer = await db.Customers.FindAsync(customerId);
            if (customer != null)
            {
                customer.KycStatus = "Pending";
            }

            await db.SaveChangesAsync();

            return Ok(new { message = "KYC Submitted Successfully" });
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var _ = new System.Net.Mail.MailAddress(email);
                return true;
            }
            catch
            {
                return false;
            }
        }

        // STEP 2 — Send OTP
        [HttpPost("send-otp")]
        public async Task<IActionResult> SendOtp()
        {
            var customerId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var req = db.KycRequests.FirstOrDefault(x => x.CustomerId == customerId);
            if (req == null)
                return NotFound("Submit KYC first");

            var otp = otpService.GenerateOtp();

            try
            {
                otpService.SendOtpEmail(req.Email, otp);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }

            req.OtpCode = otp;
            req.OtpGeneratedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();

            return Ok(new { message = "OTP Sent to Email" });
        }

        // STEP 3 — Verify OTP
        [HttpPost("verify-otp")]
public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto dto)
{
    var customerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    var req = db.KycRequests.FirstOrDefault(x => x.CustomerId == customerId);
    if (req == null)
        return NotFound("No KYC Record Found");

    if (req.OtpCode != dto.Otp)
        return BadRequest("Invalid OTP");

    req.IsOtpVerified = true;

    //  FIX: Set to Pending for admin approval
    req.Status = "Pending";

    //  DO NOT SET Approved here
    var customer = await db.Customers.FindAsync(customerId);
    customer!.KycStatus = "Pending";

    await db.SaveChangesAsync();

    return Ok(new { message = "OTP Verified Successfully — Awaiting Admin Approval" });
}
    }
}