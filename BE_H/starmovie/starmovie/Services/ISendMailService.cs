namespace starmovie.Services
{
    public interface ISendMailService
    {
        Task<bool> SendEmailAsync(string to, string subject, string body);
    }
}