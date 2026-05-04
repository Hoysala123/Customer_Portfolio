using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class KycRequest
    {
        [Key]
        public Guid Id { get; set; }

        public Guid CustomerId { get; set; }

        public string Name { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;

        public string Status { get; set; } = "Pending";

        //  OTP FIELDS (Required)
        public string? OtpCode { get; set; }
        public DateTime? OtpGeneratedAt { get; set; }
        public bool IsOtpVerified { get; set; } = false;
    }
}