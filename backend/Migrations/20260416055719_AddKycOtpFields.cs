using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddKycOtpFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsOtpVerified",
                table: "KycRequests",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "OtpCode",
                table: "KycRequests",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "OtpGeneratedAt",
                table: "KycRequests",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsOtpVerified",
                table: "KycRequests");

            migrationBuilder.DropColumn(
                name: "OtpCode",
                table: "KycRequests");

            migrationBuilder.DropColumn(
                name: "OtpGeneratedAt",
                table: "KycRequests");
        }
    }
}
