using backend.Data;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class AdminService : IAdminService
    {
        private readonly FinVistaDbContext db;

        public AdminService(FinVistaDbContext db)
        {
            this.db = db;
        }

        public async Task<IEnumerable<object>> GetAllCustomersAsync()
        {
            return await db.Customers
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
        }

        public async Task SetCustomerRiskAsync(Guid customerId, string riskLevel)
        {
            var customer = await db.Customers.FindAsync(customerId);
            if (customer == null)
                throw new InvalidOperationException("Customer not found");

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
        }

        public async Task<IEnumerable<DTOs.Admin.AdminAdvisorDto>> GetAllAdvisorsAsync()
        {
            return await db.Advisors
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
        }

        public async Task<IEnumerable<DTOs.Admin.AdminCustomerReportDto>> GetCustomerReportsAsync()
        {
            var advisorsById = await db.Advisors
                .ToDictionaryAsync(a => a.Id, a => a.Email);

            var customers = await db.Customers
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Email,
                    c.Phone,
                    c.AdvisorId,
                    c.KycStatus,
                    RiskAction = db.AuditLogs
                        .Where(a => a.CustomerId == c.Id && a.Action.StartsWith("Risk level set to "))
                        .OrderByDescending(a => a.Timestamp)
                        .Select(a => a.Action)
                        .FirstOrDefault(),
                    TotalAssets = db.Assets
                        .Where(a => a.CustomerId == c.Id)
                        .Sum(a => (decimal?)a.Amount) ?? 0,
                    TotalLiabilities = db.Loans
                        .Where(l => l.CustomerId == c.Id)
                        .Sum(l => (decimal?)(l.Amount * l.Interest)) ?? 0
                })
                .ToListAsync();

            return customers.Select(c => new DTOs.Admin.AdminCustomerReportDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                Phone = c.Phone ?? string.Empty,
                Advisor = c.AdvisorId.HasValue && advisorsById.TryGetValue(c.AdvisorId.Value, out var email)
                    ? email
                    : "Unassigned",
                KycStatus = c.KycStatus,
                Risk = !string.IsNullOrEmpty(c.RiskAction) && c.RiskAction.StartsWith("Risk level set to ")
                    ? c.RiskAction.Substring("Risk level set to ".Length)
                    : "Medium",
                TotalAssets = c.TotalAssets,
                TotalLiabilities = c.TotalLiabilities,
                NetWorth = c.TotalAssets - c.TotalLiabilities
            }).ToList();
        }
    }
}