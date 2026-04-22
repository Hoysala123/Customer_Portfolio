using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAdvisorToCustomer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AdvisorId",
                table: "Customers",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Customers_AdvisorId",
                table: "Customers",
                column: "AdvisorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Advisors_AdvisorId",
                table: "Customers",
                column: "AdvisorId",
                principalTable: "Advisors",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Advisors_AdvisorId",
                table: "Customers");

            migrationBuilder.DropIndex(
                name: "IX_Customers_AdvisorId",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "AdvisorId",
                table: "Customers");
        }
    }
}
