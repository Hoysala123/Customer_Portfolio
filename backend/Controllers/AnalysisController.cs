using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "CustomerOnly")]
    public class AnalysisController : ControllerBase
    {
        private readonly FinVistaDbContext db;

        public AnalysisController(FinVistaDbContext db)
        {
            this.db = db;
        }

        [HttpGet("{customerId}")]
        public IActionResult GetAnalysis(Guid customerId)
        {
            var authenticatedUserId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );
            if (customerId != authenticatedUserId)
                return Forbid();

            var assets = db.Assets.Where(a => a.CustomerId == customerId).ToList();
            var loans = db.Loans.Where(l => l.CustomerId == customerId).ToList();

            decimal totalAssets = assets.Sum(a => a.Amount);
            decimal totalLiabilities = loans.Sum(l => l.Amount);
            decimal total = totalAssets + totalLiabilities;

            int assetsPercent = total > 0 ? (int)((totalAssets / total) * 100) : 0;
            int liabilitiesPercent = total > 0 ? (int)((totalLiabilities / total) * 100) : 0;

            return Ok(new {
                assetsPercent,
                liabilitiesPercent,
                combinedPercent = new {
                    value = assetsPercent - liabilitiesPercent,
                    title = "Combined Analysis"
                }
            });
        }
    }
}
