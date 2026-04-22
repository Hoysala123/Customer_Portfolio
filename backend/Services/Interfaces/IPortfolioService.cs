using backend.DTOs.Portfolio;

namespace backend.Services.Interfaces
{
    public interface IPortfolioService
    {
        Task<object> GetPortfolioAsync(Guid customerId);
    }
}