using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "CustomerOnly")]
    public class ReportsController : ControllerBase
    {
        private readonly FinVistaDbContext db;

        public ReportsController(FinVistaDbContext db)
        {
            this.db = db;
        }

        [HttpGet("{customerId}")]
        public IActionResult Generate(Guid customerId)
        {
            var authenticatedUserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (authenticatedUserId == null || customerId.ToString() != authenticatedUserId)
                return Forbid();

            var assets = db.Assets.Where(a => a.CustomerId == customerId).ToList();
            var loans = db.Loans.Where(l => l.CustomerId == customerId).ToList();
            var investments = db.Investments.Where(i => i.CustomerId == customerId).ToList();

            var customer = db.Customers.FirstOrDefault(c => c.Id == customerId);

            decimal CalculateAssetSum(Asset asset)
            {
                if (asset.Type == "Bond" || asset.Type == "Bonds")
                    return asset.Amount + (asset.Amount * 8 / 100);

                if (asset.Type == "Fixed Deposit" || asset.Type == "FD")
                    return asset.Amount + (asset.Amount * 7 / 100);

                if (asset.Type == "Government Scheme")
                    return asset.Amount + (asset.Amount * 7.5m / 100);

                return asset.Amount;
            }

            var table = new List<object>();
            foreach (var a in assets)
            {
                var sum = CalculateAssetSum(a);
                table.Add(new {
                    name = a.Name,
                    purchaseDate = a.PurchaseDate.ToString("yyyy-MM-dd"),
                    dueDate = a.DueDate.ToString("yyyy-MM-dd"),
                    interest = a.Interest,
                    amount = a.Amount,
                    sum
                });
            }
            foreach (var l in loans)
            {
                table.Add(new {
                    name = l.Name,
                    purchaseDate = l.IssuedDate.ToString("yyyy-MM-dd"),
                    dueDate = l.DueDate.ToString("yyyy-MM-dd"),
                    interest = l.Interest,
                    amount = l.Amount,
                    sum = l.Amount * l.Interest
                });
            }

            var netWorth = assets.Sum(a => CalculateAssetSum(a))
                          - loans.Sum(l => l.Amount * l.Interest);

            return Ok(new
            {
                table,
                netWorth,
                customerName = customer?.Name,
                customerPhone = customer?.Phone,
                customerEmail = customer?.Email
            });
        }
    }
}