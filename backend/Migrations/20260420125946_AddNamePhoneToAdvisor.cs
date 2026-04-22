using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddNamePhoneToAdvisor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Advisors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Advisors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Investments_CustomerId",
                table: "Investments",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Assets_CustomerId",
                table: "Assets",
                column: "CustomerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Assets_Customers_CustomerId",
                table: "Assets",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Investments_Customers_CustomerId",
                table: "Investments",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Assets_Customers_CustomerId",
                table: "Assets");

            migrationBuilder.DropForeignKey(
                name: "FK_Investments_Customers_CustomerId",
                table: "Investments");

            migrationBuilder.DropIndex(
                name: "IX_Investments_CustomerId",
                table: "Investments");

            migrationBuilder.DropIndex(
                name: "IX_Assets_CustomerId",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Advisors");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Advisors");
        }
    }
}
