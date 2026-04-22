using System.Text.Json.Serialization;

namespace backend.DTOs.Advisor
{
    public class PortfolioMonthDto
    {
        [JsonPropertyName("month")]
        public string Month { get; set; } = string.Empty;

        [JsonPropertyName("value")]
        public decimal Value { get; set; }
    }
}
