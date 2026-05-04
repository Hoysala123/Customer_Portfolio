using backend.Data;
using backend.DTOs.Auth;
using backend.Services.Interfaces;   //  REQUIRED
using Microsoft.EntityFrameworkCore;

namespace backend.Services.AuthService
{
    public class AdminAuthService : IAuthService<AdminLoginRequest>
    {
        private readonly FinVistaDbContext db;
        private readonly IJwtService jwt;

        public AdminAuthService(FinVistaDbContext db, IJwtService jwt)
        {
            this.db = db;
            this.jwt = jwt;
        }

        public async Task<AuthResponse> LoginAsync(AdminLoginRequest request)
        {
            var admin = await db.Admins
                .FirstOrDefaultAsync(x => x.Email == request.Username);

            //  Plain‑text comparison (as requested)
            if (admin == null || admin.PasswordHash != request.Password)
                throw new Exception("Invalid admin credentials");

            return new AuthResponse
            {
                Id = admin.Id,
                Role = "Admin",
                Token = jwt.GenerateToken(admin.Id.ToString(), "Admin")
            };
        }
    }
}