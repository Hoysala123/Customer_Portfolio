using backend.Data;
using backend.DTOs.Investment;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "CustomerOnly")]
    public class InvestmentsController : ControllerBase
    {
        private readonly FinVistaDbContext db;

        public InvestmentsController(FinVistaDbContext db)
        {
            this.db = db;
        }

        [HttpPost("{customerId}")]
        public async Task<IActionResult> AddInvestment(Guid customerId, [FromBody] InvestmentCreateDto dto)
        {
            var authenticatedUserId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            if (customerId != authenticatedUserId)
                return Forbid();

            // Minimum investment validation
            decimal minAmount = 0;
            switch (dto.Type)
            {
                case "Bonds":
                    minAmount = 25000;
                    break;
                case "FD":
                    minAmount = 10000;
                    break;
                case "Government Scheme":
                    minAmount = 1000;
                    break;
            }
            if (dto.Amount < minAmount)
            {
                return BadRequest(new { message = $"Minimum investment for {dto.Type} is ₹{minAmount}" });
            }

            var inv = new Investment
            {
                Id = Guid.NewGuid(),
                CustomerId = customerId,
                Type = dto.Type,
                Amount = dto.Amount,
                Date = DateTime.Parse(dto.Date),
                SumAssured = dto.SumAssured
            };

            db.Investments.Add(inv);

            // Also add to Assets table for dashboard
            var asset = new Asset
            {
                Id = Guid.NewGuid(),
                CustomerId = customerId,
                Name = dto.Type,
                Type = dto.Type,
                Amount = dto.Amount,
                Interest = dto.Type == "Bonds" ? 8 : dto.Type == "FD" ? 7 : dto.Type == "Government Scheme" ? 7.5m : 0,
                PurchaseDate = DateTime.Parse(dto.Date),
                DueDate = DateTime.Parse(dto.Date).AddYears(1)
            };
            db.Assets.Add(asset);

            await db.SaveChangesAsync();

            return Ok(new { message = "Investment added" });
        }

        [HttpGet("{customerId}")]
        public IActionResult GetInvestments(Guid customerId)
        {
            var authenticatedUserId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            if (customerId != authenticatedUserId)
                return Forbid();

            var list = db.Investments.Where(i => i.CustomerId == customerId).ToList();
            return Ok(list);
        }
    }
}