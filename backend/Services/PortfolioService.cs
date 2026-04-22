using backend.Data;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class PortfolioService : IPortfolioService
    {
        private readonly FinVistaDbContext db;

        public PortfolioService(FinVistaDbContext db)
        {
            this.db = db;
        }

        public async Task<object> GetPortfolioAsync(Guid customerId)
        {
            var assets = await db.Assets
                .Where(x => x.CustomerId == customerId)
                .ToListAsync();

            var loans = await db.Loans
                .Where(x => x.CustomerId == customerId)
                .ToListAsync();

            var investments = await db.Investments
                .Where(x => x.CustomerId == customerId)
                .ToListAsync();

            var riskLogs = await db.AuditLogs
                .Where(a => a.CustomerId == customerId && a.Action.StartsWith("Risk level set to "))
                .OrderByDescending(a => a.Timestamp)
                .ToListAsync();

            var latestRisk = riskLogs
                .Select(a => a.Action.Substring("Risk level set to ".Length))
                .FirstOrDefault() ?? "Moderate";

            return new
            {
                Assets = assets,
                Loans = loans,
                Investments = investments,
                RiskLevel = latestRisk,
                LatestRiskAlert = riskLogs.Select(a => a.Action).FirstOrDefault(),
                RiskAlerts = riskLogs.Select(a => a.Action).ToList()
            };
        }
    }
}
