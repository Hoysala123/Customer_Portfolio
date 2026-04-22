using backend.Data;
using backend.DTOs.Portfolio;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/assets")]
    [Authorize(Policy = "CustomerOnly")]
    public class AssetsController : ControllerBase
    {
        private readonly FinVistaDbContext db;

        public AssetsController(FinVistaDbContext db)
        {
            this.db = db;
        }

        // POST: /api/assets/bonds
        [HttpPost("bonds")]
        public async Task<IActionResult> AddBond([FromBody] BondsDto dto)
        {
            var customerId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var asset = new Asset
            {
                Id = Guid.NewGuid(),
                CustomerId = customerId,
                Name = dto.Name,
                Type = "Bond",
                Amount = dto.Amount,
                Interest = dto.Interest,
                PurchaseDate = dto.PurchaseDate,
                DueDate = dto.DueDate
            };

            db.Assets.Add(asset);
            await db.SaveChangesAsync();

            return Ok(new { message = "Bond added successfully!" });
        }

        // POST: /api/assets/fd
        [HttpPost("fd")]
        public async Task<IActionResult> AddFD([FromBody] FixedDepositDto dto)
        {
            var customerId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var asset = new Asset
            {
                Id = Guid.NewGuid(),
                CustomerId = customerId,
                Name = dto.Name,
                Type = "Fixed Deposit",
                Amount = dto.Amount,
                Interest = dto.Interest,
                PurchaseDate = dto.PurchaseDate,
                DueDate = dto.DueDate
            };

            db.Assets.Add(asset);
            await db.SaveChangesAsync();

            return Ok(new { message = "Fixed Deposit added successfully!" });
        }

        // POST: /api/assets/loans
        [HttpPost("loans")]
public async Task<IActionResult> AddLoan([FromBody] LoanDto dto)
{
    if (dto.IssuedDate == null || dto.DueDate == null)
    {
        return BadRequest("IssuedDate and DueDate are required");
    }

    var customerId = Guid.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)!
    );

    var loan = new Loan
    {
        Id = Guid.NewGuid(),
        CustomerId = customerId,
        Name = dto.Name,
        Amount = dto.Amount,
        Interest = dto.Interest,
        IssuedDate = dto.IssuedDate.Value,
        DueDate = dto.DueDate.Value
    };

    db.Loans.Add(loan);
    await db.SaveChangesAsync();

            return Ok(new { message = "Loan added successfully!" });
}
    }
}