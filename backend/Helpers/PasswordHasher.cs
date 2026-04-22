using System.Security.Cryptography;
using System.Text;

namespace backend.Helpers
{
    public static class PasswordHasher
    {
        // Hash password using SHA256
        public static string Hash(string password)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha.ComputeHash(bytes);

            return Convert.ToBase64String(hash);
        }

        // Verify password
        public static bool Verify(string password, string hash)
        {
            return Hash(password) == hash;
        }
    }
}