namespace backend.DTOs.Kyc
{
    public class KycActionResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; }

        public KycActionResponseDto()
        {
            Message = "";
        }

        public KycActionResponseDto(bool success, string message)
        {
            Success = success;
            Message = message;
        }
    }
}

