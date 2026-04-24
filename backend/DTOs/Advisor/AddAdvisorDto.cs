namespace backend.DTOs.Advisor
{
    public class AddAdvisorDto
    {
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
    }
}
