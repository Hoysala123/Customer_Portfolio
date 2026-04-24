using backend.Data;
using backend.DTOs.Advisor;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize(Policy = "AdminOnly")] // Temporarily commented out for testing
    public class AdminController : ControllerBase
    {
        private readonly IAdminService admin;
        private readonly FinVistaDbContext db;

        public AdminController(IAdminService admin, FinVistaDbContext db)
        {
            this.admin = admin;
            this.db = db;
        }

        [HttpGet("customers")]
        public async Task<IActionResult> Customers()
        {
            var data = await admin.GetAllCustomersAsync();
            return Ok(data);
        }

        [HttpGet("reports/customers")]
        public async Task<IActionResult> GetCustomerReports()
        {
            var data = await admin.GetCustomerReportsAsync();
            return Ok(data);
        }

        [HttpGet("dashboard/audit-logs")]
        public async Task<IActionResult> GetAuditLogs()
        {
            var auditLogs = await db.AuditLogs
                .OrderByDescending(a => a.Timestamp)
                .Take(4)
                .Select(a => new
                {
                    Name = db.Customers
                        .Where(c => c.Id == a.CustomerId)
                        .Select(c => c.Name)
                        .FirstOrDefault() ?? "Unknown",
                    a.Role,
                    a.Action,
                    a.Status
                })
                .ToListAsync();

            return Ok(auditLogs);
        }

        [HttpGet("advisors")]
        public async Task<IActionResult> Advisors()
        {
            var data = await admin.GetAllAdvisorsAsync();
            return Ok(data);
        }

        [HttpPost("customers/{customerId}/risk")]
        public async Task<IActionResult> SetCustomerRisk(Guid customerId, RiskUpdateDto dto)
        {
            var normalized = dto.RiskLevel?.Trim();
            if (normalized != "High" && normalized != "Medium" && normalized != "Low")
                return BadRequest(new { message = "RiskLevel must be High, Medium or Low." });

            try
            {
                await admin.SetCustomerRiskAsync(customerId, normalized);
                return Ok(new { riskLevel = normalized });
            }
            catch (InvalidOperationException)
            {
                return NotFound();
            }
        }

        [HttpGet("customers/{customerId}/report")]
        public async Task<IActionResult> DownloadCustomerReport(Guid customerId)
        {
            var customer = await db.Customers.FirstOrDefaultAsync(c => c.Id == customerId);
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
                var sum = loan.Amount * (loan.Interest / 100m);
                csv += $"{loan.Name},{loan.IssuedDate:yyyy-MM-dd},{loan.DueDate:yyyy-MM-dd},{loan.Interest},{loan.Amount},{sum}\n";
            }

            var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
            var fileName = $"customer-report-{customer.Name.Replace(' ', '-')}.csv";
            return File(bytes, "text/csv", fileName);
        }

        [HttpGet("dashboard/portfolio-performance")]
        public async Task<IActionResult> GetPortfolioPerformance([FromQuery] Guid? advisorId = null)
        {
            // Get investments data
            IQueryable<Investment> investmentQuery = db.Investments.Include(i => i.Customer);
            if (advisorId.HasValue)
            {
                investmentQuery = investmentQuery.Where(i => i.Customer != null && i.Customer.AdvisorId == advisorId.Value);
            }

            var investmentData = await investmentQuery
                .GroupBy(i => new { i.Date.Year, i.Date.Month })
                .Select(g => new
                {
                    year = g.Key.Year,
                    month = g.Key.Month,
                    value = g.Sum(i => i.Amount)
                })
                .ToListAsync();

            // Get assets data
            IQueryable<Asset> assetQuery = db.Assets.Include(a => a.Customer);
            if (advisorId.HasValue)
            {
                assetQuery = assetQuery.Where(a => a.Customer != null && a.Customer.AdvisorId == advisorId.Value);
            }

            var assetData = await assetQuery
                .GroupBy(a => new { a.PurchaseDate.Year, a.PurchaseDate.Month })
                .Select(g => new
                {
                    year = g.Key.Year,
                    month = g.Key.Month,
                    value = g.Sum(a => a.Amount)
                })
                .ToListAsync();

            // Combine investments and assets data
            var combinedData = investmentData.Concat(assetData)
                .GroupBy(d => new { d.year, d.month })
                .Select(g => new
                {
                    month = new DateTime(g.Key.year, g.Key.month, 1).ToString("MMM yyyy"),
                    value = g.Sum(d => d.value)
                })
                .OrderBy(d => d.month)
                .ToList();

            return Ok(combinedData);
        }

        [HttpGet("dashboard/asset-allocation")]
        public async Task<IActionResult> GetAssetAllocation([FromQuery] Guid? advisorId = null)
        {
            // Get total assets (excluding fixed deposits)
            IQueryable<Asset> assetQuery = db.Assets.Include(a => a.Customer);
            if (advisorId.HasValue)
            {
                assetQuery = assetQuery.Where(a => a.Customer != null && a.Customer.AdvisorId == advisorId.Value);
            }
            var totalAssets = await assetQuery
                .Where(a => a.Type != "Fixed Deposit" && a.Type != "FD")
                .SumAsync(a => (decimal?)a.Amount) ?? 0;

            // Get total fixed deposits
            var totalFixedDeposits = await assetQuery
                .Where(a => a.Type == "Fixed Deposit" || a.Type == "FD")
                .SumAsync(a => (decimal?)a.Amount) ?? 0;

            // Get total loans
            IQueryable<Loan> loanQuery = db.Loans.Include(l => l.Customer);
            if (advisorId.HasValue)
            {
                loanQuery = loanQuery.Where(l => l.Customer != null && l.Customer.AdvisorId == advisorId.Value);
            }
            var totalLoans = await loanQuery.SumAsync(l => (decimal?)l.Amount) ?? 0;

            // Calculate percentages
            var total = totalAssets + totalFixedDeposits + totalLoans;
            var result = new List<dynamic>();

            if (total > 0)
            {
                result.Add(new
                {
                    label = "Total Assets",
                    percentage = Math.Round((double)totalAssets / (double)total * 100, 2)
                });

                result.Add(new
                {
                    label = "Total Fixed Deposits",
                    percentage = Math.Round((double)totalFixedDeposits / (double)total * 100, 2)
                });

                result.Add(new
                {
                    label = "Total Loans",
                    percentage = Math.Round((double)totalLoans / (double)total * 100, 2)
                });
            }
            else
            {
                result.Add(new { label = "Total Assets", percentage = 0 });
                result.Add(new { label = "Total Fixed Deposits", percentage = 0 });
                result.Add(new { label = "Total Loans", percentage = 0 });
            }

            return Ok(result);
        }

        [HttpGet("dashboard/summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            try
            {
                // Total users (customers + advisors)
                var totalCustomers = await db.Customers.CountAsync();
                var totalAdvisors = await db.Advisors.CountAsync();
                var totalUsers = totalCustomers + totalAdvisors;

                // Total assets (sum of all customer assets)
                var totalAssets = await db.Assets.SumAsync(a => (decimal?)a.Amount) ?? 0;

                // Active alerts: active KYC requests
                var activeKycRequests = await db.Customers
                    .Where(c => c.KycStatus == "Pending")
                    .CountAsync();

                var activeAlerts = activeKycRequests;

                var summary = new DTOs.Admin.AdminDashboardSummaryDto
                {
                    TotalUsers = totalUsers,
                    TotalCustomers = totalCustomers,
                    TotalAssets = (int)totalAssets,
                    ActiveAlerts = activeAlerts
                };

                return Ok(summary);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
