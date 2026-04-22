namespace backend.DTOs.Advisor
{
    public class AdvisorPortfolioDto
    {
        public string CustomerId { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string RiskProfile { get; set; } = null!;
        public decimal InvestmentAmount { get; set; }
    }
}