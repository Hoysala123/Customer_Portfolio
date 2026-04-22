namespace backend.DTOs.Investment
{
    public class InvestmentResponseDto
    {
        public Guid Id { get; set; }
        public string Type { get; set; } = null!;
        public decimal Amount { get; set; }
        public string Date { get; set; } = null!;
        public decimal SumAssured { get; set; }
    }
}