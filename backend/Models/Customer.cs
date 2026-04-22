using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Customer
    {
        [Key]
        public Guid Id { get; set; }

        public string Username { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string KycStatus { get; set; } = "Pending";

        public Guid? AdvisorId { get; set; }
        public Advisor? Advisor { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}