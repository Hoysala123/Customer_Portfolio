using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class AuditLog
    {
        [Key]
        public Guid Id { get; set; }

        public Guid CustomerId { get; set; }
        public string Role { get; set; } = null!;
        public string Action { get; set; } = null!;
        public string Status { get; set; } = null!;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
    }
}