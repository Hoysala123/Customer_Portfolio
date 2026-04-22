namespace backend.DTOs.Portfolio
{
    public class LoanDto
    {
        public string Name { get; set; } = null!;
        public DateTime? IssuedDate { get; set; }
        public DateTime? DueDate { get; set; }
        public decimal Amount { get; set; }
        public decimal Interest { get; set; }
    }
}
