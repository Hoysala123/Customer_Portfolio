namespace backend.DTOs.Advisor
{
    public class AdvisorDashboardSummaryDto
    {
        public int TotalCustomers { get; set; }
        public string TotalAssets { get; set; } = null!;
        public int RiskAlerts { get; set; }
    }
}