namespace backend.Services.Interfaces
{
    public interface IAdminService
    {
        Task<IEnumerable<object>> GetAllCustomersAsync();
        Task<IEnumerable<DTOs.Admin.AdminAdvisorDto>> GetAllAdvisorsAsync();
        Task<IEnumerable<DTOs.Admin.AdminCustomerReportDto>> GetCustomerReportsAsync();
        Task SetCustomerRiskAsync(Guid customerId, string riskLevel);
    }
}