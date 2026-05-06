using backend.Data;
using backend.Models;
using backend.Services.Interfaces;
using backend.Helpers;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    /// <summary>
    /// Service for admin-related operations and reporting.
    /// </summary>
    public class AdminService : IAdminService
    {
        private readonly FinVistaDbContext db;
        private readonly ILogger<AdminService> logger;
        private readonly PortfolioService portfolioService;

        public AdminService(FinVistaDbContext db, ILogger<AdminService> logger, PortfolioService portfolioService)
        {
            this.db = db;
            this.logger = logger;
            this.portfolioService = portfolioService;
        }

        public async Task<IEnumerable<object>> GetAllCustomersAsync()
        {
            logger.LogInfo("Retrieving all customers");

            try
            {
                var customers = await db.Customers.ToListAsync();
                var assets = await db.Assets.ToListAsync();
                var loans = await db.Loans.ToListAsync();

                var result = customers
                    .Select(c => new
                    {
                        c.Id,
                        c.Name,
                        c.Username,
                        c.Email,
                        c.Phone,
                        Advisor = c.Advisor != null ? c.Advisor.Email : "Unassigned",
                        c.KycStatus,
                        Risk = portfolioService.CalculateRiskLevel(
                            assets.Where(a => a.CustomerId == c.Id).Sum(a => a.Amount),
                            loans.Where(l => l.CustomerId == c.Id).Sum(l => l.Amount)
                        )
                    })
                    .ToList();

                logger.LogInfo($"All customers retrieved successfully - Count: {result.Count}");
                return result;
            }
            catch (Exception ex)
            {
                logger.LogErr(ex, "Failed to retrieve all customers");
                throw;
            }
        }

        public async Task SetCustomerRiskAsync(Guid customerId, string riskLevel)
        {
            logger.LogInfo($"Calculating customer risk - CustomerId: {customerId}");

            try
            {
                var customer = await db.Customers.FindAsync(customerId);
                if (customer == null)
                {
                    logger.LogWarn($"Calculate customer risk failed - Customer not found: {customerId}");
                    throw new InvalidOperationException("Customer not found");
                }

                // Get customer's assets and liabilities
                var assets = await db.Assets
                    .Where(a => a.CustomerId == customerId)
                    .ToListAsync();

                var loans = await db.Loans
                    .Where(l => l.CustomerId == customerId)
                    .ToListAsync();

                decimal totalAssets = assets.Sum(a => a.Amount);
                decimal totalLiabilities = loans.Sum(l => l.Amount);

                // Calculate risk automatically
                var calculatedRisk = portfolioService.CalculateRiskLevel(totalAssets, totalLiabilities);

                db.AuditLogs.Add(new AuditLog
                {
                    Id = Guid.NewGuid(),
                    CustomerId = customerId,
                    Role = "Admin",
                    Action = $"Risk level {calculatedRisk}",
                    Status = "Success",
                    Timestamp = DateTime.UtcNow
                });

                await db.SaveChangesAsync();
                logger.LogInfo($"Risk level {calculatedRisk}");
            }
            catch (Exception ex)
            {
                logger.LogErr(ex, $"Failed to calculate customer risk - CustomerId: {customerId}");
                throw;
            }
        }

        public async Task<IEnumerable<DTOs.Admin.AdminAdvisorDto>> GetAllAdvisorsAsync()
        {
            logger.LogInfo("Retrieving all advisors");

            try
            {
                var result = await db.Advisors
                    .Select(a => new DTOs.Admin.AdminAdvisorDto
                    {
                        Id = a.Id,
                        Name = a.Name ?? a.Email,
                        Email = a.Email,
                        Contact = a.Phone ?? "",
                        Status = "Active", // Assuming all are active
                        AllocatedCustomerCount = db.Customers.Count(c => c.AdvisorId == a.Id)
                    })
                    .ToListAsync();

                logger.LogInfo($"All advisors retrieved successfully - Count: {result.Count}");
                return result;
            }
            catch (Exception ex)
            {
                logger.LogErr(ex, "Failed to retrieve all advisors");
                throw;
            }
        }

        public async Task<IEnumerable<DTOs.Admin.AdminCustomerReportDto>> GetCustomerReportsAsync()
        {
            logger.LogInfo("Generating customer reports");

            try
            {
                var advisorsById = await db.Advisors
                    .ToDictionaryAsync(a => a.Id, a => a.Email);

                // Get all customers with their related data
                var customers = await db.Customers.ToListAsync();
                var assets = await db.Assets.ToListAsync();
                var loans = await db.Loans.ToListAsync();

                var report = customers.Select(c => 
                {
                    // ========== CALCULATE TOTAL ASSETS ==========
                    decimal totalAssets = assets
                        .Where(a => a.CustomerId == c.Id)
                        .Sum(a => a.Amount);

                    // ========== CALCULATE TOTAL LIABILITIES ==========
                    decimal totalLiabilities = loans
                        .Where(l => l.CustomerId == c.Id)
                        .Sum(l => l.Amount);

                    // ========== CALCULATE NET WORTH ==========
                    decimal netWorth = totalAssets - totalLiabilities;

                    // ========== CALCULATE RISK LEVEL ==========
                    var riskLevel = portfolioService.CalculateRiskLevel(totalAssets, totalLiabilities);

                    return new DTOs.Admin.AdminCustomerReportDto
                    {
                        Id = c.Id,
                        Name = c.Name,
                        Email = c.Email,
                        Phone = c.Phone ?? string.Empty,
                        Advisor = c.AdvisorId.HasValue ? 
                            advisorsById.GetValueOrDefault(c.AdvisorId.Value, "Unassigned") : "Unassigned",
                        KycStatus = c.KycStatus,
                        Risk = riskLevel,
                        TotalAssets = totalAssets,
                        TotalLiabilities = totalLiabilities,
                        NetWorth = netWorth
                    };
                }).ToList();

                logger.LogInfo($"Customer reports generated successfully - Count: {report.Count}");
                return report;
            }
            catch (Exception ex)
            {
                logger.LogErr(ex, "Failed to generate customer reports");
                return new List<DTOs.Admin.AdminCustomerReportDto>();
            }
        }
    }
}