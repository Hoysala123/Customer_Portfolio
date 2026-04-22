namespace backend.DTOs.Admin
{
    public class AdminInvestmentProductDto
    {
        public string Name { get; set; } = null!;
        public string Category { get; set; } = null!;
        public decimal InterestRate { get; set; }
        public decimal MinInvestment { get; set; }
        public decimal TotalReturn { get; set; }
    }
}