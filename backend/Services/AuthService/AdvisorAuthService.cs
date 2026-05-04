using backend.Data;
using backend.DTOs.Auth;
using backend.Services.Interfaces;   //  REQUIRED
using Microsoft.EntityFrameworkCore;

namespace backend.Services.AuthService
{
    public class AdvisorAuthService : IAuthService<AdvisorLoginRequest>
    {
        private readonly FinVistaDbContext db;
        private readonly IJwtService jwt;

        public AdvisorAuthService(FinVistaDbContext db, IJwtService jwt)
        {
            this.db = db;
            this.jwt = jwt;
        }

        public async Task<AuthResponse> LoginAsync(AdvisorLoginRequest request)
        {
            var advisor = await db.Advisors
                .FirstOrDefaultAsync(x => x.Email == request.Username);

            // ✅ Plain‑text comparison
            if (advisor == null || advisor.PasswordHash != request.Password)
                throw new Exception("Invalid advisor credentials");

            return new AuthResponse
            {
                Id = advisor.Id,
                Role = "Advisor",
                Token = jwt.GenerateToken(advisor.Id.ToString(), "Advisor")
            };
        }
    }
}
