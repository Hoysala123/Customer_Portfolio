namespace backend.DTOs.Kyc
{
    public class KycResponseDto
    {
        public Guid Id { get; set; }              // REQUIRED
        public string CustomerName { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Status { get; set; } = null!;
    }
}