using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Admin
    {
        [Key]
        public Guid Id { get; set; }

        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
    }
}