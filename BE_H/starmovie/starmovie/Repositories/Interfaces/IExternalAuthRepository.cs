using Microsoft.AspNetCore.Identity;
using starmovie.Models;

namespace starmovie.Repositories.Interfaces
{
    public interface IExternalAuthRepository
    {
        Task<LoginResponse?> HandleExternalLoginAsync(ExternalLoginInfo info);
    }
}