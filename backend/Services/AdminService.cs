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

        public AdminService(FinVistaDbContext db, ILogger<AdminService> logger)
        {
            this.db = db;
            this.logger = logger;
        }

        public async Task<IEnumerable<object>> GetAllCustomersAsync()
        {
            logger.LogInfo("Retrieving all customers");

            try
            {
                var result = await db.Customers
                    .Select(c => new
                    {
                        c.Id,
                        c.Name,
                        c.Username,
                        c.Email,
                        c.Phone,
                        Advisor = c.Advisor != null ? c.Advisor.Email : "Unassigned",
                        c.KycStatus,
                        Risk = db.AuditLogs
                            .Where(a => a.CustomerId == c.Id && a.Action.StartsWith("Risk level set to "))
                            .OrderByDescending(a => a.Timestamp)
                            .Select(a => a.Action.Substring("Risk level set to ".Length))
                            .FirstOrDefault() ?? "Medium"
                    })
                    .ToListAsync();

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
            logger.LogInfo($"Setting customer risk - CustomerId: {customerId}, RiskLevel: {riskLevel}");

            try
            {
                var customer = await db.Customers.FindAsync(customerId);
                if (customer == null)
                {
                    logger.LogWarn($"Set customer risk failed - Customer not found: {customerId}");
                    throw new InvalidOperationException("Customer not found");
                }

                db.AuditLogs.Add(new AuditLog
                {
                    Id = Guid.NewGuid(),
                    CustomerId = customerId,
                    Role = "Admin",
                    Action = $"Risk level set to {riskLevel}",
                    Status = "Success",
                    Timestamp = DateTime.UtcNow
                });

                await db.SaveChangesAsync();
                logger.LogInfo($"Customer risk set successfully - CustomerId: {customerId}, RiskLevel: {riskLevel}");
            }
            catch (Exception ex)
            {
                logger.LogErr(ex, $"Failed to set customer risk - CustomerId: {customerId}");
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
                var auditLogs = await db.AuditLogs.ToListAsync();

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

                    // ========== GET RISK LEVEL ==========
                    var riskAction = auditLogs
                        .Where(a => a.CustomerId == c.Id && a.Action.StartsWith("Risk level set to "))
                        .OrderByDescending(a => a.Timestamp)
                        .FirstOrDefault()?
                        .Action;

                    var riskLevel = !string.IsNullOrEmpty(riskAction) && riskAction.StartsWith("Risk level set to ")
                        ? riskAction.Substring("Risk level set to ".Length)
                        : "Medium";

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