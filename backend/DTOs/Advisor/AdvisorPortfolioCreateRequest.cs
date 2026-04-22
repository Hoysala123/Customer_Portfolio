namespace backend.DTOs.Advisor
{
    public class AdvisorPortfolioCreateRequest
    {
        public List<PortfolioAllocationDto> Allocation { get; set; } = null!;
    }

    public class PortfolioAllocationDto
    {
        public string AssetType { get; set; } = null!;
        public int Percentage { get; set; }
    }
}