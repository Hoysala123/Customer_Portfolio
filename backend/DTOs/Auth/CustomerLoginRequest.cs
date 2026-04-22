namespace backend.DTOs.Auth
{
    public class CustomerLoginRequest
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
