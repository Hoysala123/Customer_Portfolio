using backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "CustomerOnly")]
    public class PortfolioController : ControllerBase
    {
        private readonly IPortfolioService portfolio;

        public PortfolioController(IPortfolioService portfolio)
        {
            this.portfolio = portfolio;
        }

        [HttpGet("{customerId}")]
        public async Task<IActionResult> GetPortfolio(Guid customerId)
        {
            var authenticatedUserId = Guid.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            if (customerId != authenticatedUserId)
                return Forbid();

            var data = await portfolio.GetPortfolioAsync(customerId);
            return Ok(data);
        }
    }
}
