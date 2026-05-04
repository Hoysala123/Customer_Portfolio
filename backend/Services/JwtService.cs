using backend.Services.Interfaces;
using backend.Helpers;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.Services
{
    /// <summary>
    /// Service for generating and validating JWT tokens.
    /// </summary>
    public class JwtService : IJwtService
    {
        private readonly IConfiguration configuration;
        private readonly ILogger<JwtService> logger;

        public JwtService(IConfiguration configuration, ILogger<JwtService> logger)
        {
            this.configuration = configuration;
            this.logger = logger;
        }

        public string GenerateToken(string userId, string role)
        {
            logger.LogInfo($"Generating JWT token - UserId: {userId}, Role: {role}");

            try
            {
                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userId),
                    new Claim(ClaimTypes.Role, role)
                };

                var key = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(configuration["JwtSettings:Key"]!)
                );

                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(6),
                    signingCredentials: creds
                );

                var jwtToken = new JwtSecurityTokenHandler().WriteToken(token);
                logger.LogInfo($"JWT token generated successfully - UserId: {userId}");
                return jwtToken;
            }
            catch (Exception ex)
            {
                logger.LogErr(ex, $"JWT token generation failed - UserId: {userId}, Role: {role}");
                throw;
            }
        }
    }
}
