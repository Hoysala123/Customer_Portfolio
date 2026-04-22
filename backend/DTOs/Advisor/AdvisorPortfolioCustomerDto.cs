namespace backend.DTOs.Advisor
{
    public class AdvisorPortfolioCustomerDto
    {
        public Guid CustomerId { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string KycStatus { get; set; } = null!;
        public decimal TotalAssets { get; set; }
        public bool PortfolioCreated { get; set; }
    }
}