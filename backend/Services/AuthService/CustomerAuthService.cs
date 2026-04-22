using backend.Data;
using backend.DTOs.Auth;
using backend.Helpers;
using backend.Models;
using backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace backend.Services.AuthService
{
    public class CustomerAuthService : IAuthService<CustomerLoginRequest>
    {
        private readonly FinVistaDbContext db;
        private readonly IJwtService jwt;

        public CustomerAuthService(FinVistaDbContext db, IJwtService jwt)
        {
            this.db = db;
            this.jwt = jwt;
        }

        public async Task<AuthResponse> LoginAsync(CustomerLoginRequest request)
        {
            var customer = await db.Customers
                .FirstOrDefaultAsync(x => x.Username == request.Username);

            if (customer == null || !PasswordHasher.Verify(request.Password, customer.PasswordHash))
                throw new Exception("Invalid customer credentials");

            var token = jwt.GenerateToken(customer.Id.ToString(), "Customer");

            return new AuthResponse
            {
                Id = customer.Id,
                Role = "Customer",
                Token = token,
                KycStatus = customer.KycStatus,
                Name = customer.Name
            };
        }
    }
}