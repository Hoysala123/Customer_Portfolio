using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using backend.DTOs.Auth;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace backend.Tests
{
    public class AuthorizationTests
    {
        [Fact]
        public async Task AdminOnlyEndpoint_ReturnsForbidden_ForCustomerToken()
        {
            var factory = new WebApplicationFactory<Program>()
                .WithWebHostBuilder(builder =>
                {
                    builder.ConfigureServices(services =>
                    {
                        // REMOVE existing DB context
                        var descriptor = services.SingleOrDefault(
                            d => d.ServiceType == typeof(DbContextOptions<FinVistaDbContext>));

                        if (descriptor != null)
                            services.Remove(descriptor);

                        // USE IN-MEMORY DB FOR TEST
                        services.AddDbContext<FinVistaDbContext>(options =>
                            options.UseInMemoryDatabase("AuthorizationTestDb"));

                        // SEED TEST DATA
                        var sp = services.BuildServiceProvider();
                        using var scope = sp.CreateScope();
                        var db = scope.ServiceProvider.GetRequiredService<FinVistaDbContext>();

                        db.Database.EnsureDeleted();
                        db.Database.EnsureCreated();

                        // Seed Admin (plain text)
                        db.Admins.Add(new Admin
                        {
                            Id = Guid.NewGuid(),
                            Email = "admin@finvista.com",
                            PasswordHash = "Admin@123"
                        });

                        // Seed Advisor
                        db.Advisors.Add(new Advisor
                        {
                            Id = Guid.NewGuid(),
                            Email = "advisor@finvista.com",
                            PasswordHash = "Advisor@123"
                        });

                        db.SaveChanges();
                    });
                });

            using var client = factory.CreateClient();

            // ===========================
            // 1. REGISTER CUSTOMER
            // ===========================
            var registerPayload = new
            {
                Name = "Test Customer",
                Username = "testcustomer",
                Password = "Password1!",
                Email = "testcustomer@finvista.com",
                Phone = "1234567890"
            };

            var registerResponse = await client.PostAsync(
                "/api/auth/register",
                new StringContent(JsonSerializer.Serialize(registerPayload), Encoding.UTF8, "application/json")
            );

            registerResponse.EnsureSuccessStatusCode();

            // ===========================
            // 2. CUSTOMER LOGIN
            // ===========================
            var loginPayload = new
            {
                Username = "testcustomer",
                Password = "Password1!"
            };

            var loginResponse = await client.PostAsync(
                "/api/auth/customer/login",
                new StringContent(JsonSerializer.Serialize(loginPayload), Encoding.UTF8, "application/json")
            );

            loginResponse.EnsureSuccessStatusCode();

            var loginBody = await loginResponse.Content.ReadAsStringAsync();

            var loginResult = JsonSerializer.Deserialize<AuthResponse>(loginBody,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            Assert.NotNull(loginResult?.Token);

            // SET JWT TOKEN
            client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", loginResult.Token);

            // ===========================
            // 3. CALL ADMIN ENDPOINT WITH CUSTOMER TOKEN
            // ===========================
            var adminResponse = await client.GetAsync("/api/admin/kyc/requests");

            Assert.Equal(HttpStatusCode.Forbidden, adminResponse.StatusCode);
        }
    }
}
