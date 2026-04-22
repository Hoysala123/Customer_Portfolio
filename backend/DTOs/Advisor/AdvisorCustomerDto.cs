namespace backend.DTOs.Advisor
{
    public class AdvisorCustomerDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Assets { get; set; } = null!;
        public string Liabilities { get; set; } = null!;
        public string Risk { get; set; } = null!;
        public string KycStatus { get; set; } = null!;
        public bool Alert { get; set; }
        public bool PortfolioCreated { get; set; }
    }
}