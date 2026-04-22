namespace backend.DTOs.Portfolio
{
    public class FixedDepositDto
    {
        public string Name { get; set; } = null!;
        public DateTime PurchaseDate { get; set; }
        public DateTime DueDate { get; set; }
        public decimal Amount { get; set; }
        public decimal Interest { get; set; }
    }
}
