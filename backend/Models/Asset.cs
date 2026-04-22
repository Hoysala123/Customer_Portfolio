using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class Asset
    {
        [Key]
        public Guid Id { get; set; }

        public Guid CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public string Name { get; set; } = null!;
        public string Type { get; set; } = null!;
        
        public decimal Amount { get; set; }
        public decimal Interest { get; set; }

        public DateTime PurchaseDate { get; set; }
        public DateTime DueDate { get; set; }
    }
}