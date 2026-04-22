using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminAdvisor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
{
    migrationBuilder.InsertData(
        table: "Admins",
        columns: new[] { "Id", "Email", "PasswordHash" },
        values: new object[]
        {
            Guid.NewGuid(), "admin@finvista.com", "Admin@123"
        }
    );

    migrationBuilder.InsertData(
        table: "Advisors",
        columns: new[] { "Id", "Email", "PasswordHash" },
        values: new object[]
        {
            Guid.NewGuid(), "advisor@finvista.com", "Advisor@123"
        }
    );
}

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
