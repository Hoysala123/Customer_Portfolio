namespace backend.DTOs.Reports
{
    public class CustomerReportRowDto
    {
        public string Name { get; set; } = null!;
        public string PurchaseDate { get; set; } = null!;
        public string DueDate { get; set; } = null!;
        public string Interest { get; set; } = null!;
        public string Amount { get; set; } = null!;
        public int Quantity { get; set; }
        public string Sum { get; set; } = null!;
    }
}