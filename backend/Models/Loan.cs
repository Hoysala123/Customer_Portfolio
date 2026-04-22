using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Loan
    {
        [Key]
        public Guid Id { get; set; }

        public Guid CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public string Name { get; set; } = null!;

        public decimal Amount { get; set; }
        public decimal Interest { get; set; }

        public DateTime IssuedDate { get; set; }
        public DateTime DueDate { get; set; }
    }
}