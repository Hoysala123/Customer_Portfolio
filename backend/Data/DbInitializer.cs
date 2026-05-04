using backend.Models;
using backend.Helpers;

namespace backend.Data
{
    public static class DbInitializer
    {
        private record InvestmentSeed(string Type, decimal Amount);
        private record CustomerSeed(string FirstName, string LastName, string Phone, string KycStatus, string AdvisorEmail, InvestmentSeed[] Investments);

        public static void Initialize(FinVistaDbContext db)
        {
            try
            {
                // ============================
                // ONLY SEED IF NOT EXISTS
                // ============================
                // Check if data already exists
                if (db.Admins.Any() && db.Advisors.Any())
                {
                    return; // Data already seeded, don't delete/recreate
                }

                // ============================
                // DELETE ONLY IF EMPTY/FIRST RUN
                // ============================
                // Clear in reverse order of foreign key dependencies
                var kycRequests = db.KycRequests.ToList();
                if (kycRequests.Count > 0) db.KycRequests.RemoveRange(kycRequests);
                
                var auditLogs = db.AuditLogs.ToList();
                if (auditLogs.Count > 0) db.AuditLogs.RemoveRange(auditLogs);
                
                var investments = db.Investments.ToList();
                if (investments.Count > 0) db.Investments.RemoveRange(investments);
                
                var assets = db.Assets.ToList();
                if (assets.Count > 0) db.Assets.RemoveRange(assets);
                
                var loans = db.Loans.ToList();
                if (loans.Count > 0) db.Loans.RemoveRange(loans);
                
                var customersToDelete = db.Customers.ToList();
                if (customersToDelete.Count > 0) db.Customers.RemoveRange(customersToDelete);
                
                var advisorsToDelete = db.Advisors.ToList();
                if (advisorsToDelete.Count > 0) db.Advisors.RemoveRange(advisorsToDelete);
                
                var admins = db.Admins.ToList();
                if (admins.Count > 0) db.Admins.RemoveRange(admins);
                
                db.SaveChanges();

                // ============================
                // SEED ADMIN (PLAIN TEXT PASSWORD)
                // ============================
                db.Admins.Add(new Admin
                {
                    Id = Guid.NewGuid(),
                    Email = "admin@finvista.com",
                    PasswordHash = "Admin@123"
                });
                db.SaveChanges();

                // ============================
                // SEED ADVISORS (PLAIN TEXT PASSWORD)
                // ============================
                db.Advisors.Add(new Advisor
                {
                    Id = Guid.NewGuid(),
                    Name = "Advisor1",
                    Email = "advisor@finvista.com",
                    Phone = "9611971395",
                    PasswordHash = "Advisor@123"
                });

                db.Advisors.Add(new Advisor
                {
                    Id = Guid.NewGuid(),
                    Name = "Advisor2",
                    Email = "advisor2@finvista.com",
                    Phone = "6364221063",
                    PasswordHash = "Advisor2@123"
                });
                db.SaveChanges();

            // ============================
            // SEED CUSTOMERS FROM DYNAMIC TEMPLATES
            // ============================
            if (!db.Customers.Any())
            {
                var advisorDict = db.Advisors.ToDictionary(a => a.Email, a => a.Id);

                var firstNames = new[] { "John", "Jane", "Bob" };
                var lastNames = new[] { "Doe", "Smith", "Johnson" };
                var phones = new[] { "1234567890", "0987654321", "1122334455" };
                var statuses = new[] { "Approved", "Pending", "Approved" };
                var advisorEmails = new[] { "advisor@finvista.com", "advisor@finvista.com", "advisor2@finvista.com" };
                var investmentSets = new[]
                {
                    new InvestmentSeed[]
                    {
                        new InvestmentSeed("Stocks", 50000M),
                        new InvestmentSeed("Bonds", 30000M)
                    },
                    Array.Empty<InvestmentSeed>(),
                    new[]
                    {
                        new InvestmentSeed("Mutual Funds", 25000M)
                    }
                };

                var customerTemplates = firstNames.Select((firstName, index) =>
                    new CustomerSeed(
                        FirstName: firstName,
                        LastName: lastNames[index],
                        Phone: phones[index],
                        KycStatus: statuses[index],
                        AdvisorEmail: advisorEmails[index],
                        Investments: investmentSets[index]
                    )).ToArray();

                foreach (var template in customerTemplates)
                {
                    if (!advisorDict.TryGetValue(template.AdvisorEmail, out var advisorId))
                        continue;

                    var usernameBase = (template.FirstName + template.LastName).ToLowerInvariant();
                    var uniqueSuffix = DateTime.UtcNow.Ticks % 10000;
                    var username = usernameBase + uniqueSuffix;
                    var email = $"{template.FirstName.ToLowerInvariant()}.{template.LastName.ToLowerInvariant()}.{uniqueSuffix}@example.com";

                    var customer = new Customer
                    {
                        Id = Guid.NewGuid(),
                        Name = $"{template.FirstName} {template.LastName}",
                        Username = username,
                        Phone = template.Phone,
                        Email = email,
                        PasswordHash = PasswordHasher.Hash("Password@123"),
                        KycStatus = template.KycStatus,
                        AdvisorId = advisorId
                    };

                    db.Customers.Add(customer);
                    db.SaveChanges();

                    foreach (var investmentTemplate in template.Investments)
                    {
                        db.Investments.Add(new Investment
                        {
                            Id = Guid.NewGuid(),
                            CustomerId = customer.Id,
                            Type = investmentTemplate.Type,
                            Amount = investmentTemplate.Amount,
                            Date = DateTime.Now,
                            SumAssured = investmentTemplate.Amount
                        });
                    }

                    db.Assets.Add(new Asset
                    {
                        Id = Guid.NewGuid(),
                        CustomerId = customer.Id,
                        Name = "Bond Investment",
                        Type = "Bond",
                        Amount = 25000M,
                        Interest = 5M,
                        PurchaseDate = DateTime.UtcNow.AddMonths(-6),
                        DueDate = DateTime.UtcNow.AddMonths(6)
                    });

                    db.Assets.Add(new Asset
                    {
                        Id = Guid.NewGuid(),
                        CustomerId = customer.Id,
                        Name = "Fixed Deposit",
                        Type = "Fixed Deposit",
                        Amount = 20000M,
                        Interest = 4M,
                        PurchaseDate = DateTime.UtcNow.AddMonths(-4),
                        DueDate = DateTime.UtcNow.AddMonths(8)
                    });

                    db.Loans.Add(new Loan
                    {
                        Id = Guid.NewGuid(),
                        CustomerId = customer.Id,
                        Name = "Home Loan",
                        Amount = 15000M,
                        Interest = 6M,
                        IssuedDate = DateTime.UtcNow.AddMonths(-12),
                        DueDate = DateTime.UtcNow.AddMonths(24)
                    });

                    db.SaveChanges();
                }
            }

            if (db.Customers.Any())
            {
                var seededCustomers = db.Customers.ToList();

                foreach (var customer in seededCustomers)
                {
                    if (!db.Loans.Any(l => l.CustomerId == customer.Id))
                    {
                        db.Loans.Add(new Loan
                        {
                            Id = Guid.NewGuid(),
                            CustomerId = customer.Id,
                            Name = "Customer Loan",
                            Amount = 10000M,
                            Interest = 5M,
                            IssuedDate = DateTime.UtcNow.AddMonths(-10),
                            DueDate = DateTime.UtcNow.AddMonths(14)
                        });
                    }
                }

                db.SaveChanges();
            }

            // ============================
            // SEED PENDING KYC REQUESTS FOR TESTING
            // ============================
            if (!db.KycRequests.Any())
            {
                var customersToSeedKyc = db.Customers.Take(2).ToList();

                foreach (var customer in customersToSeedKyc)
                {
                    db.KycRequests.Add(new KycRequest
                    {
                        Id = Guid.NewGuid(),
                        CustomerId = customer.Id,
                        Name = customer.Name,
                        Phone = customer.Phone,
                        Email = customer.Email,
                        Status = "Pending",
                        IsOtpVerified = true,
                        OtpCode = "123456",
                        OtpGeneratedAt = DateTime.UtcNow.AddHours(-1)
                    });
                }

                db.SaveChanges();
            }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Database initialization error: {ex.Message}");
                throw;
            }
        }
    }
}
