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

        // -------------------- CUSTOMERS --------------------

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

        // -------------------- AUDIT LOGS --------------------

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

        // -------------------- ADVISORS --------------------

        [HttpGet("advisors")]
        public async Task<IActionResult> Advisors()
        {
            var data = await admin.GetAllAdvisorsAsync();
            return Ok(data);
        }

        [HttpPost("advisors")]
        public async Task<IActionResult> AddAdvisor([FromBody] AddAdvisorDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Phone) ||
                string.IsNullOrWhiteSpace(dto.PasswordHash))
            {
                return BadRequest(new { message = "All fields are required" });
            }

            if (await db.Advisors.AnyAsync(a => a.Email == dto.Email))
            {
                return BadRequest(new { message = "Email already exists" });
            }

            var advisor = new Advisor
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                PasswordHash = dto.PasswordHash
            };

            db.Advisors.Add(advisor);
            await db.SaveChangesAsync();

            return Ok(new { message = "Advisor added successfully", advisorId = advisor.Id });
        }

        // -------------------- CUSTOMER RISK --------------------

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
            catch
            {
                return NotFound();
            }
        }

        // -------------------- CUSTOMER REPORT DOWNLOAD --------------------

        [HttpGet("customers/{customerId}/report")]
        public async Task<IActionResult> DownloadCustomerReport(Guid customerId)
        {
            var customer = await db.Customers.FirstOrDefaultAsync(c => c.Id == customerId);
            if (customer == null)
                return NotFound();

            var assets = await db.Assets.Where(a => a.CustomerId == customerId).ToListAsync();
            var loans = await db.Loans.Where(l => l.CustomerId == customerId).ToListAsync();

            string csv = "Name,PurchaseDate,DueDate,Interest,Amount,Sum\n";

            foreach (var asset in assets)
            {
                csv += $"{asset.Name},{asset.PurchaseDate:yyyy-MM-dd},{asset.DueDate:yyyy-MM-dd},{asset.Interest},{asset.Amount},{asset.Amount}\n";
            }

            foreach (var loan in loans)
            {
                var years = (loan.DueDate - loan.IssuedDate).TotalDays / 365;
                var sum = (loan.Amount * loan.Interest * (decimal)years) / 100;
                csv += $"{loan.Name},{loan.IssuedDate:yyyy-MM-dd},{loan.DueDate:yyyy-MM-dd},{loan.Interest},{loan.Amount},{sum}\n";
            }

            var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
            return File(bytes, "text/csv", $"customer-report-{customer.Name}.csv");
        }

        // -------------------- PORTFOLIO PERFORMANCE (MONTH-WISE ASSETS) --------------------

        [HttpGet("dashboard/portfolio-performance")]
        public async Task<IActionResult> GetPortfolioPerformance([FromQuery] Guid? advisorId = null)
        {
            IQueryable<Asset> query = db.Assets.Include(a => a.Customer);

            if (advisorId.HasValue)
            {
                query = query.Where(a => a.Customer.AdvisorId == advisorId.Value);
            }

            var result = await query
                .GroupBy(a => new { a.PurchaseDate.Year, a.PurchaseDate.Month })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month)
                .Select(g => new
                {
                    month = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
                    value = g.Sum(a => a.Amount)
                })
                .ToListAsync();

            return Ok(result);
        }

        // -------------------- ASSET ALLOCATION --------------------

        [HttpGet("dashboard/asset-allocation")]
public async Task<IActionResult> GetAssetAllocation([FromQuery] Guid? advisorId = null)
{
    IQueryable<Asset> assetQuery = db.Assets.Include(a => a.Customer);

    if (advisorId.HasValue)
    {
        assetQuery = assetQuery
            .Where(a => a.Customer != null && a.Customer.AdvisorId == advisorId.Value);
    }

    // ✅ Bonds (includes Govt + normal bonds)
    var bonds = await assetQuery
        .Where(a => a.Type == "Bond" || a.Type == "Bonds" || a.Type == "govt")
        .SumAsync(a => (decimal?)a.Amount) ?? 0;

    // ✅ Fixed Deposits
    var fixedDeposits = await assetQuery
        .Where(a => a.Type == "Fixed Deposit" || a.Type == "FD")
        .SumAsync(a => (decimal?)a.Amount) ?? 0;

    // ✅ Loans
    IQueryable<Loan> loanQuery = db.Loans.Include(l => l.Customer);
    if (advisorId.HasValue)
    {
        loanQuery = loanQuery
            .Where(l => l.Customer != null && l.Customer.AdvisorId == advisorId.Value);
    }

    var loans = await loanQuery.SumAsync(l => (decimal?)l.Amount) ?? 0;

    var total = bonds + fixedDeposits + loans;

    return Ok(new[]
    {
        new { label = "Bonds", percentage = total == 0 ? 0 : Math.Round((double)(bonds * 100 / total), 2) },
        new { label = "Fixed Deposits", percentage = total == 0 ? 0 : Math.Round((double)(fixedDeposits * 100 / total), 2) },
        new { label = "Loans", percentage = total == 0 ? 0 : Math.Round((double)(loans * 100 / total), 2) }
    });
}

        // -------------------- ✅ FIXED DASHBOARD SUMMARY --------------------

        [HttpGet("dashboard/summary")]
        public async Task<IActionResult> GetDashboardSummary()
        {
            try
            {
                var totalCustomers = await db.Customers.CountAsync();
                var totalAdvisors = await db.Advisors.CountAsync();
                var totalUsers = totalCustomers + totalAdvisors;

                // ✅ FIX: Assets ONLY (NO investments)
                var totalAssets = (int)(
                    await db.Assets.SumAsync(a => (decimal?)a.Amount) ?? 0
                );

                var activeAlerts = await db.Customers
                    .Where(c => c.KycStatus == "Pending")
                    .CountAsync();

                return Ok(new
                {
                    totalUsers,
                    totalCustomers,
                    totalAssets,
                    activeAlerts
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}