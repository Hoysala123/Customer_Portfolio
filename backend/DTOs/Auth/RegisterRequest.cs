namespace backend.DTOs.Auth
{
    public class RegisterRequest
    {
        public string Name { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
