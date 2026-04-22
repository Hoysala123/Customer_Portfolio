using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Mail;

namespace backend.Services
{
    public class OtpService
    {
        private readonly IConfiguration _config;

        public OtpService(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateOtp()
        {
            return new Random().Next(100000, 999999).ToString();
        }

        public void SendOtpEmail(string toEmail, string otp)
        {
            if (string.IsNullOrWhiteSpace(toEmail))
                throw new ArgumentException("Email address is required.", nameof(toEmail));

            try
            {
                var fromAddress = new MailAddress(_config["SmtpSettings:SenderEmail"]!);
                var toAddress = new MailAddress(toEmail);

                var smtp = _config.GetSection("SmtpSettings");

                var portStr = smtp["Port"];
                if (string.IsNullOrEmpty(portStr))
                {
                    throw new InvalidOperationException("SMTP Port is not configured.");
                }

                var client = new SmtpClient(smtp["Server"])
                {
                    Port = int.Parse(portStr),
                    EnableSsl = true
                };
                client.UseDefaultCredentials = false;
                client.Credentials = new NetworkCredential(
                    smtp["Username"],
                    smtp["Password"]
                );

                var message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = "Your OTP for KYC Verification",
                    Body = $"Your OTP is: {otp}",
                    IsBodyHtml = false
                };

                client.Send(message);
            }
            catch (FormatException ex)
            {
                throw new ArgumentException("Invalid email address format.", nameof(toEmail), ex);
            }
        }
    }
}