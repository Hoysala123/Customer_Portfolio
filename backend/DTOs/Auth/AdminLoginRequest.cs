using System.Text.Json.Serialization;

namespace backend.DTOs.Auth
{
    public class AdminLoginRequest
    {
        [JsonPropertyName("email")]
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}