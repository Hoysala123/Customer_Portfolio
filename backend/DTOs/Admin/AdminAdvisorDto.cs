namespace backend.DTOs.Admin
{
    public class AdminAdvisorDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Contact { get; set; } = null!;
        public string Status { get; set; } = null!;
        public int AllocatedCustomerCount { get; set; }
    }
}