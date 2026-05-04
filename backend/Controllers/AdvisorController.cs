using backend.Data;
using backend.DTOs.Advisor;
using backend.Models;
using backend.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "AdvisorOnly")]
    public class AdvisorController : ControllerBase
    {
        private readonly FinVistaDbContext db;
        private readonly ILogger<AdvisorController> logger;

        public AdvisorController(FinVistaDbContext db, ILogger<AdvisorController> logger)
        {
            this.db = db;
            this.logger = logger;
        }

        [HttpGet("customers")]
        public async Task<IActionResult> GetCustomersUnderAdvisor()
        {
            var advisorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            logger.LogInfo($"GET /api/advisor/customers called by advisor: {advisorId}");

            try
            {
                var customers = await db.Customers
                    .Where(c => c.AdvisorId == advisorId)
                    .ToListAsync();

                var customerIds = customers.Select(c => c.Id).ToList();

                var investments = await db.Investments
                    .Where(i => customerIds.Contains(i.CustomerId))
                    .ToListAsync();

                var loans = await db.Loans
                    .Where(l => customerIds.Contains(l.CustomerId))
                    .ToListAsync();

                var riskLogs = await db.AuditLogs
                    .Where(a => customerIds.Contains(a.CustomerId) && a.Action.StartsWith("Risk level set to "))
                    .OrderByDescending(a => a.Timestamp)
                    .ToListAsync();

                var result = customers.Select(c => new AdvisorCustomerDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    Username = c.Username,
                    Email = c.Email,
                    Phone = c.Phone,
                    Assets = investments.Where(i => i.CustomerId == c.Id).Sum(i => i.Amount).ToString("F0"),
                    Liabilities = loans.Where(l => l.CustomerId == c.Id).Sum(l => l.Amount).ToString("F0"),
                    Risk = riskLogs
                        .Where(a => a.CustomerId == c.Id)
                        .Select(a => a.Action.Substring("Risk level set to ".Length))
                        .FirstOrDefault() ?? "Medium",
                    KycStatus = c.KycStatus,
                    Alert = !investments.Any(i => i.CustomerId == c.Id && i.Type == "Portfolio Created"),
                    PortfolioCreated = investments.Any(i => i.CustomerId == c.Id && i.Type == "Portfolio Created")
                })
                .ToList();

                logger.LogInfo($"Retrieved customers for advisor - Count: {result.Count}");
                return Ok(result);
            }
            catch (Exception ex)
            {
                logger.LogErr(ex, $"Failed to retrieve customers for advisor: {advisorId}");
                return BadRequest(new { message = $"Error: {ex.Message}" });
            }
        }

        [HttpPost("customers/{customerId}/risk")]
        public async Task<IActionResult> SetCustomerRisk(Guid customerId, RiskUpdateDto dto)
        {
            var advisorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            logger.LogInfo($"POST /api/advisor/customers/{customerId}/risk called by advisor: {advisorId} - Risk: {dto.RiskLevel}");

            try
            {
                var customer = await db.Customers
                    .FirstOrDefaultAsync(c => c.Id == customerId && c.AdvisorId == advisorId);

                if (customer == null)
                {
                    logger.LogWarn($"Risk update failed - Customer {customerId} not found for advisor {advisorId}");
                    return NotFound();
                }

                var normalized = dto.RiskLevel?.Trim();
                if (normalized != "High" && normalized != "Medium" && normalized != "Low")
                {
                    logger.LogWarn($"Risk update failed - Invalid risk level: {normalized}");
                    return BadRequest(new { message = "RiskLevel must be High, Medium or Low." });
                }

                db.AuditLogs.Add(new AuditLog
                {
                    Id = Guid.NewGuid(),
                    CustomerId = customer.Id,
                    Role = "Advisor",
                    Action = $"Risk level set to {normalized}",
                    Status = "Success",
                    Timestamp = DateTime.UtcNow
                });

                await db.SaveChangesAsync();
                logger.LogInfo($"Risk level updated successfully - CustomerId: {customerId}, Risk: {normalized}");
                return Ok(new { riskLevel = normalized });
            }
            catch (Exception ex)
            {
                logger.LogErr(ex, $"Failed to update risk level for customer: {customerId}");
                return BadRequest(new { message = $"Error: {ex.Message}" });
            }
        }

        [HttpPost("customers/{customerId}/alert")]
        public async Task<IActionResult> SendCustomerAlert(Guid customerId)
        {
            var advisorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var customer = await db.Customers
                .FirstOrDefaultAsync(c => c.Id == customerId && c.AdvisorId == advisorId);

            if (customer == null)
                return NotFound();

            db.AuditLogs.Add(new AuditLog
            {
                Id = Guid.NewGuid(),
                CustomerId = customer.Id,
                Role = "Customer",
                Action = "Alert from advisor",
                Status = "Success",
                Timestamp = DateTime.UtcNow
            });

            await db.SaveChangesAsync();
            return Ok(new { message = "Alert sent to customer." });
        }

        [HttpGet("customers/{customerId}/report")]
        public async Task<IActionResult> DownloadCustomerReport(Guid customerId)
        {
            var advisorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var customer = await db.Customers
                .FirstOrDefaultAsync(c => c.Id == customerId && c.AdvisorId == advisorId);

            if (customer == null)
                return NotFound();

            var assets = await db.Assets.Where(a => a.CustomerId == customerId).ToListAsync();
            var loans = await db.Loans.Where(l => l.CustomerId == customerId).ToListAsync();
            var investments = await db.Investments.Where(i => i.CustomerId == customerId).ToListAsync();

            string csv = "Name,PurchaseDate,DueDate,Interest,Amount,Sum\n";

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

            foreach (var asset in assets)
            {
                var sum = CalculateAssetSum(asset);
                csv += $"{asset.Name},{asset.PurchaseDate:yyyy-MM-dd},{asset.DueDate:yyyy-MM-dd},{asset.Interest},{asset.Amount},{sum}\n";
            }

            foreach (var loan in loans)
            {
                var timeInYears = (loan.DueDate - loan.IssuedDate).TotalDays / 365;
                var sum = (loan.Amount * loan.Interest * (decimal)timeInYears) / 100;
                csv += $"{loan.Name},{loan.IssuedDate:yyyy-MM-dd},{loan.DueDate:yyyy-MM-dd},{loan.Interest},{loan.Amount},{sum}\n";
            }

            var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
            var fileName = $"customer-report-{customer.Name.Replace(' ', '-')}.csv";
            return File(bytes, "text/csv", fileName);
        }

        [HttpGet("portfolio/{customerId}")]
        public async Task<IActionResult> GetCustomerForPortfolio(Guid customerId)
        {
            var advisorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var customer = await db.Customers
                .Where(c => c.Id == customerId && c.AdvisorId == advisorId)
                .Select(c => new AdvisorPortfolioCustomerDto
                {
                    CustomerId = c.Id,
                    Name = c.Name,
                    Email = c.Email,
                    KycStatus = c.KycStatus,
                    TotalAssets = db.Investments.Where(i => i.CustomerId == c.Id).Sum(i => (decimal?)i.Amount) ?? 0,
                    PortfolioCreated = db.Investments.Any(i => i.CustomerId == c.Id && i.Type == "Portfolio Created")
                })
                .FirstOrDefaultAsync();

            if (customer == null)
                return NotFound();

            return Ok(customer);
        }

        [HttpPost("portfolio/{customerId}")]
        public async Task<IActionResult> CreatePortfolio(Guid customerId, PortfolioCreateDto dto)
        {
            var advisorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var customer = await db.Customers
                .FirstOrDefaultAsync(c => c.Id == customerId && c.AdvisorId == advisorId);

            if (customer == null)
                return NotFound();

            if (await db.Investments.AnyAsync(i => i.CustomerId == customerId && i.Type == "Portfolio Created"))
                return BadRequest(new { message = "Portfolio already exists for this customer." });

            // Create a simple portfolio entry to mark the portfolio as created.
            db.Investments.Add(new Investment
            {
                Id = Guid.NewGuid(),
                CustomerId = customer.Id,
                Type = "Portfolio Created",
                Amount = 0,
                Date = DateTime.UtcNow,
                SumAssured = 0
            });

            db.AuditLogs.Add(new AuditLog
            {
                Id = Guid.NewGuid(),
                CustomerId = customer.Id,
                Role = "Customer",
                Action = "Portfolio has been created",
                Status = "Success",
                Timestamp = DateTime.UtcNow
            });

            await db.SaveChangesAsync();

            return Ok(new { message = "Portfolio created successfully." });
        }

        [HttpGet("dashboard/summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            var advisorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var customerIds = await db.Customers
                .Where(c => c.AdvisorId == advisorId)
                .Select(c => c.Id)
                .ToListAsync();

            var totalCustomers = customerIds.Count;

            var investmentTotal = await db.Investments
                .Where(i => customerIds.Contains(i.CustomerId))
                .SumAsync(i => (decimal?)i.Amount) ?? 0;

            var assetTotal = await db.Assets
                .Where(a => customerIds.Contains(a.CustomerId))
                .SumAsync(a => (decimal?)a.Amount) ?? 0;

            var totalAssets = investmentTotal + assetTotal;

            var riskAlerts = await db.Customers
                .Where(c => c.AdvisorId == advisorId)
                .Where(c => !db.Investments.Any(i => i.CustomerId == c.Id && i.Type == "Portfolio Created"))
                .CountAsync();

            return Ok(new
            {
                totalCustomers,
                totalAssets,
                riskAlerts
            });
        }

        [HttpGet("dashboard/audit-logs")]
        public async Task<IActionResult> GetAuditLogs()
        {
            var advisorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var customerIds = await db.Customers
                .Where(c => c.AdvisorId == advisorId)
                .Select(c => c.Id)
                .ToListAsync();

            var auditLogs = await db.AuditLogs
                .Where(a => customerIds.Contains(a.CustomerId))
                .OrderByDescending(a => a.Timestamp)
                .Take(1)
                .Select(a => new
                {
                    CustomerName = db.Customers.Where(c => c.Id == a.CustomerId).Select(c => c.Name).FirstOrDefault(),
                    a.Action,
                    a.Status
                })
                .ToListAsync();

            return Ok(auditLogs);
        }

        [HttpGet("dashboard/customers-without-portfolio")]
        public async Task<IActionResult> GetCustomersWithoutPortfolio()
        {
            var advisorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var customerIds = await db.Customers
                .Where(c => c.AdvisorId == advisorId)
                .Select(c => c.Id)
                .ToListAsync();

            var customersWithoutPortfolio = await db.Customers
                .Where(c => c.AdvisorId == advisorId)
                .Where(c => !db.Investments.Any(i => i.CustomerId == c.Id && i.Type == "Portfolio Created"))
                .Select(c => new
                {
                    c.Id,
                    c.Name
                })
                .ToListAsync();

            return Ok(customersWithoutPortfolio);
        }

        [HttpGet("reports/customers")]
        public async Task<IActionResult> GetCustomerReports()
        {
            var advisorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var reports = await db.Customers
                .Where(c => c.AdvisorId == advisorId)
                .Select(c => new
                {
                    Id = c.Id,
                    Name = c.Name,
                    Assets = db.Assets
                        .Where(a => a.CustomerId == c.Id)
                        .Sum(a => (decimal?)a.Amount) ?? 0,
                    Liabilities = db.Loans
                        .Where(l => l.CustomerId == c.Id)
                        .Sum(l => (decimal?)l.Amount) ?? 0,
                    Risk = db.AuditLogs
                        .Where(a => a.CustomerId == c.Id && a.Action.StartsWith("Risk level set to "))
                        .OrderByDescending(a => a.Timestamp)
                        .Select(a => a.Action.Substring("Risk level set to ".Length))
                        .FirstOrDefault() ?? "Medium"
                })
                .ToListAsync();

            return Ok(reports);
        }

        [HttpGet("reports/portfolio-performance")]
        public async Task<IActionResult> GetPortfolioPerformance()
        {
            var advisorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var customerIds = await db.Customers
                .Where(c => c.AdvisorId == advisorId)
                .Select(c => c.Id)
                .ToListAsync();

            // Get all assets with customer info grouped by month
            var assetData = await db.Assets
                .Where(a => customerIds.Contains(a.CustomerId))
                .Include(a => a.Customer)
                .GroupBy(a => new { a.PurchaseDate.Year, a.PurchaseDate.Month })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month)
                .Select(g => new backend.DTOs.Advisor.PortfolioMonthDto
                {
                    Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
                    Value = g.Sum(a => a.Amount)
                })
                .ToListAsync();

            // Get all investments with customer info grouped by month
            var investmentData = await db.Investments
                .Where(i => customerIds.Contains(i.CustomerId))
                .Include(i => i.Customer)
                .Where(i => i.Type != "Portfolio Created") // Exclude marker entries
                .GroupBy(i => new { i.Date.Year, i.Date.Month })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month)
                .Select(g => new backend.DTOs.Advisor.PortfolioMonthDto
                {
                    Month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
                    Value = g.Sum(i => i.Amount)
                })
                .ToListAsync();

            // Merge both data sources
            var allMonths = assetData.Select(d => d.Month)
                .Concat(investmentData.Select(d => d.Month))
                .Distinct()
                .OrderBy(m => DateTime.ParseExact(m, "MMM yyyy", System.Globalization.CultureInfo.InvariantCulture))
                .ToList();

            var mergedData = allMonths.Select(month => new backend.DTOs.Advisor.PortfolioMonthDto
            {
                Month = month,
                Value = (assetData.FirstOrDefault(d => d.Month == month)?.Value ?? 0) +
                        (investmentData.FirstOrDefault(d => d.Month == month)?.Value ?? 0)
            }).ToList();

            // If no data, return dummy data for visualization
            if (!mergedData.Any())
            {
                mergedData = new List<backend.DTOs.Advisor.PortfolioMonthDto>
                {
                    new backend.DTOs.Advisor.PortfolioMonthDto { Month = DateTime.UtcNow.ToString("MMM yyyy"), Value = 0 }
                };
            }

            return Ok(mergedData);
        }

        [HttpGet("reports/overall-analysis")]
        public async Task<IActionResult> GetOverallAnalysis()
        {
            var advisorId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var customerIds = await db.Customers
                .Where(c => c.AdvisorId == advisorId)
                .Select(c => c.Id)
                .ToListAsync();

            // Get asset values by type
            var bondValue = await db.Assets
                .Where(a => customerIds.Contains(a.CustomerId) && (a.Type == "Bond" || a.Type == "Bonds"))
                .SumAsync(a => (decimal?)a.Amount) ?? 0;

            var fixedDepositValue = await db.Assets
                .Where(a => customerIds.Contains(a.CustomerId) && (a.Type == "Fixed Deposit" || a.Type == "FD"))
                .SumAsync(a => (decimal?)a.Amount) ?? 0;

            var loanValue = await db.Loans
                .Where(l => customerIds.Contains(l.CustomerId))
                .SumAsync(l => (decimal?)l.Amount) ?? 0;

            var result = new[]
            {
                new { label = "Bonds", value = (int)bondValue },
                new { label = "Fixed Deposit", value = (int)fixedDepositValue },
                new { label = "Loans", value = (int)loanValue }
            };

            return Ok(result);
        }
    }
}

