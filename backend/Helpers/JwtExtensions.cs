using System.Security.Claims;

namespace backend.Helpers
{
    public static class JwtExtensions
    {
        public static Guid GetUserId(this ClaimsPrincipal user)
        {
            string? id = user.FindFirstValue(ClaimTypes.NameIdentifier);
            return Guid.Parse(id!);
        }
    }
}