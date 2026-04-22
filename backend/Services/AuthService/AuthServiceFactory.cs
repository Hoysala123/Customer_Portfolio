using backend.DTOs.Auth;
using backend.Services.Interfaces;
using System;

namespace backend.Services.AuthService
{
    public class AuthServiceFactory
    {
        private readonly IServiceProvider _serviceProvider;

        public AuthServiceFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public IAuthService<T> GetAuthService<T>(string role)
        {
            return role switch
            {
                "Admin" => (IAuthService<T>)_serviceProvider.GetService(typeof(AdminAuthService))!,
                "Advisor" => (IAuthService<T>)_serviceProvider.GetService(typeof(AdvisorAuthService))!,
                "Customer" => (IAuthService<T>)_serviceProvider.GetService(typeof(CustomerAuthService))!,
                _ => throw new ArgumentException($"Unknown role: {role}")
            };
        }
    }
}
