using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Options;
using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using starmovie.Models;

namespace starmovie.Services
{
    public class SendMailService : ISendMailService
    {
        private readonly EmailSettings _emailSettings;

        // Inject EmailSettings từ cấu hình
        public SendMailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        // Kiểm tra tính hợp lệ của email
        private bool IsValidEmail(string email)
        {
            var emailRegex = @"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$";
            return Regex.IsMatch(email, emailRegex);
        }

        public async Task<bool> SendEmailAsync(string to, string subject, string body)
        {
            // Kiểm tra tính hợp lệ của email
            if (!IsValidEmail(to))
            {
                throw new ArgumentException("Email không hợp lệ: " + to);
            }

            try
            {
                // Tạo đối tượng MimeMessage
                var email = new MimeMessage();
                email.From.Add(new MailboxAddress(_emailSettings.SenderName, _emailSettings.SenderEmail));
                email.To.Add(MailboxAddress.Parse(to));
                email.Subject = subject;

                // Tạo body email dưới dạng HTML
                var builder = new BodyBuilder { HtmlBody = body };
                email.Body = builder.ToMessageBody();

                // Kết nối và gửi email qua SMTP
                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(_emailSettings.SmtpServer, _emailSettings.SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_emailSettings.SenderEmail, _emailSettings.SenderPassword);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                return true;
            }
            catch (Exception ex)
            {
                // Ghi lỗi chi tiết vào log
                Console.WriteLine($"Lỗi gửi email: {ex.Message}");
                return false;
            }
        }
    }
}
