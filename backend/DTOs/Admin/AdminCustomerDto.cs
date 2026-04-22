namespace backend.DTOs.Admin
{
    public class AdminCustomerDto
    {
        public string Name { get; set; } = null!;
        public string Username { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Advisor { get; set; } = null!;
        public string KycStatus { get; set; } = null!;
    }
}