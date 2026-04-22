using backend.DTOs.Auth;

namespace backend.Services.Interfaces
{
    public interface IAuthService<T>
    {
        Task<AuthResponse> LoginAsync(T request);
    }
}