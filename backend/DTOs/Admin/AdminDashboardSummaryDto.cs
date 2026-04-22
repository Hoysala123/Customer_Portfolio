namespace backend.DTOs.Admin
{
    public class AdminDashboardSummaryDto
    {
        public int TotalUsers { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalAssets { get; set; }
        public int ActiveAlerts { get; set; }
    }
}