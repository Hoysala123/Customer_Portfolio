using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Investment
    {
        [Key]
        public Guid Id { get; set; }

        public Guid CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public string Type { get; set; } = null!;
        public decimal Amount { get; set; }

        public DateTime Date { get; set; }

        public decimal SumAssured { get; set; }
    }
}