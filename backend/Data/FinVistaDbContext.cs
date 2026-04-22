using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class FinVistaDbContext : DbContext
    {
        public FinVistaDbContext(DbContextOptions<FinVistaDbContext> options)
            : base(options)
        {
        }

        // =======================
        // DbSets
        // =======================
        public DbSet<Customer> Customers { get; set; } = null!;
        public DbSet<Admin> Admins { get; set; } = null!;
        public DbSet<Advisor> Advisors { get; set; } = null!;
        public DbSet<Asset> Assets { get; set; } = null!;
        public DbSet<Loan> Loans { get; set; } = null!;
        public DbSet<Investment> Investments { get; set; } = null!;
        public DbSet<KycRequest> KycRequests { get; set; } = null!;
        public DbSet<AuditLog> AuditLogs { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // =======================
            // UNIQUE KEYS
            // =======================
            builder.Entity<Customer>()
                .HasIndex(c => c.Username)
                .IsUnique();

            builder.Entity<Admin>()
                .HasIndex(a => a.Email)
                .IsUnique();

            builder.Entity<Advisor>()
                .HasIndex(a => a.Email)
                .IsUnique();

            // =======================
            // DECIMAL PRECISION FIXES
            // =======================
            builder.Entity<Asset>()
                .Property(a => a.Amount)
                .HasPrecision(18, 2);

            builder.Entity<Asset>()
                .Property(a => a.Interest)
                .HasPrecision(5, 2);

            builder.Entity<Customer>()
                .HasOne(c => c.Advisor)
                .WithMany(a => a.Customers)
                .HasForeignKey(c => c.AdvisorId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.Entity<Loan>()
                .Property(l => l.Amount)
                .HasPrecision(18, 2);

            builder.Entity<Loan>()
                .Property(l => l.Interest)
                .HasPrecision(5, 2);

            builder.Entity<Investment>()
                .Property(i => i.Amount)
                .HasPrecision(18, 2);

            builder.Entity<Investment>()
                .Property(i => i.SumAssured)
                .HasPrecision(18, 2);
        }
    }
}