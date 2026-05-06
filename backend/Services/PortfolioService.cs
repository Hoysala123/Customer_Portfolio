using backend.Data;
using backend.Models;
using backend.Services.Interfaces;
using backend.Helpers;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    /// <summary>
    /// Service for portfolio management and calculations.
    /// </summary>
    public class PortfolioService : IPortfolioService
    {
        private readonly FinVistaDbContext db;
        private readonly ILogger<PortfolioService> logger;

        public PortfolioService(FinVistaDbContext db, ILogger<PortfolioService> logger)
        {
            this.db = db;
            this.logger = logger;
        }

        /// <summary>
        /// Calculates risk level based on customer's assets and liabilities.
        /// High risk: Liabilities are high relative to assets
        /// Moderate risk: Assets and liabilities are balanced
        /// Low risk: Assets are significantly more than liabilities
        /// </summary>
        public string CalculateRiskLevel(decimal totalAssets, decimal totalLiabilities)
        {
            if (totalAssets == 0 && totalLiabilities == 0)
                return "Moderate"; // Default for new customers with no data

            if (totalAssets == 0 && totalLiabilities > 0)
                return "High"; // Only liabilities, no assets

            decimal ratio = totalLiabilities > 0 ? totalAssets / totalLiabilities : decimal.MaxValue;

            // If liabilities are high (ratio < 1.5), risk is high
            if (ratio < 1.5m)
                return "High";

            // If assets are significantly more (ratio >= 3), risk is low
            if (ratio >= 3m)
                return "Low";

            // Otherwise, balanced - moderate risk
            return "Moderate";
        }

        public async Task<object> GetPortfolioAsync(Guid customerId)
        {
            logger.LogInfo($"Retrieving portfolio - CustomerId: {customerId}");

            try
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

                // Calculate risk dynamically based on assets and liabilities
                decimal totalAssets = assets.Sum(a => a.Amount);
                decimal totalLiabilities = loans.Sum(l => l.Amount);
                var calculatedRisk = CalculateRiskLevel(totalAssets, totalLiabilities);

                logger.LogInfo($"Portfolio data loaded - CustomerId: {customerId}, Assets: {assets.Count}, Loans: {loans.Count}, Investments: {investments.Count}, CalculatedRisk: {calculatedRisk}");

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

                var riskLogs = await db.AuditLogs
                    .Where(x => x.CustomerId == customerId && x.Action.Contains("Risk"))
                    .OrderByDescending(x => x.Timestamp)
                    .ToListAsync();

                logger.LogInfo($"Portfolio calculated successfully - CustomerId: {customerId}, NetWorth: {netWorth}, RiskLevel: {calculatedRisk}");

                return new
                {
                    assets = assets,
                    loans = loans,
                    investments = investments,
                    riskLevel = calculatedRisk,
                    latestRiskAlert = riskLogs.Select(a => a.Action).FirstOrDefault(),
                    riskAlerts = riskLogs.Select(a => a.Action).ToList(),
                    table = table,
                    netWorth = netWorth
                };
            }
            catch (Exception ex)
            {
                logger.LogErr(ex, $"Failed to retrieve portfolio - CustomerId: {customerId}");
                throw;
            }
        }
    }
}
