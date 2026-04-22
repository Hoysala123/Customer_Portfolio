namespace backend.DTOs.Admin
{
    public class AdminCustomerReportDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Advisor { get; set; } = null!;
        public string KycStatus { get; set; } = null!;
        public string Risk { get; set; } = null!;
        public decimal TotalAssets { get; set; }
        public decimal TotalLiabilities { get; set; }
        public decimal NetWorth { get; set; }
    }
}

