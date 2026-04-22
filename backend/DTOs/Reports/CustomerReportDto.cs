namespace backend.DTOs.Reports
{
    public class CustomerReportDto
    {
        public List<CustomerReportRowDto> Table { get; set; } = null!;
        public decimal NetWorth { get; set; }
    }
}