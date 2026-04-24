using backend.Data;
using backend.Models;
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
                table.Add(new
                {
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
                var timeInYears = (l.DueDate - l.IssuedDate).TotalDays / 365;
                var sum = (l.Amount * l.Interest * (decimal)timeInYears) / 100;
                table.Add(new
                {
                    name = l.Name,
                    purchaseDate = l.IssuedDate.ToString("yyyy-MM-dd"),
                    dueDate = l.DueDate.ToString("yyyy-MM-dd"),
                    interest = l.Interest,
                    amount = l.Amount,
                    sum
                });
            }

            var netWorth = assets.Sum(a => CalculateAssetSum(a))
                          - loans.Sum(l => l.Amount + (l.Amount * l.Interest * (decimal)((l.DueDate - l.IssuedDate).TotalDays / 365)) / 100);

            return new
            {
                assets = assets,
                loans = loans,
                investments = investments,
                riskLevel = latestRisk,
                latestRiskAlert = riskLogs.Select(a => a.Action).FirstOrDefault(),
                riskAlerts = riskLogs.Select(a => a.Action).ToList(),
                table = table,
                netWorth = netWorth
            };
        }
    }
}
