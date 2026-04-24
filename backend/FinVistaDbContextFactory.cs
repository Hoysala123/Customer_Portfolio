using backend.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

public class FinVistaDbContextFactory : IDesignTimeDbContextFactory<FinVistaDbContext>
{
    public FinVistaDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<FinVistaDbContext>();

        optionsBuilder.UseSqlServer(
            "Server=LTPHYD052669640\\SQLEXPRESS;Database=FinVistaDB;Trusted_Connection=True;TrustServerCertificate=True;"
        );

        return new FinVistaDbContext(optionsBuilder.Options);
    }
}