using System.Text.Json.Serialization;

namespace backend.DTOs.Auth
{
    public class AdvisorLoginRequest
    {
        [JsonPropertyName("email")]
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
