namespace backend.DTOs.Kyc
{
    public class KycSubmitDto
    {
        public string Name { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;
    }
}