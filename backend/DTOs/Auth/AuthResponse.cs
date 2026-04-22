namespace backend.DTOs.Auth
{
    public class AuthResponse
    {
        public Guid Id { get; set; }
        public string Role { get; set; } = null!;
        public string Token { get; set; } = null!;
        public string? KycStatus { get; set; }    //  ADD THIS
        public string? Name { get; set; }         // Customer name
    }
}