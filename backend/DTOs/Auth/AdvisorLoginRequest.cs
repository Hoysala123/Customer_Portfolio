namespace backend.DTOs.Auth
{
    public class AdvisorLoginRequest
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
