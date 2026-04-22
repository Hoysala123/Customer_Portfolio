using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Advisor
    {
        [Key]
        public Guid Id { get; set; }

        public string? Name { get; set; }
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        public string PasswordHash { get; set; } = null!;

        public ICollection<Customer> Customers { get; set; } = new List<Customer>();
    }
}