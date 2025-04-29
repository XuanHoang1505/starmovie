using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Facebook;
using starmovie.Repositories.Interfaces;
using starmovie.Models;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace starmovie.Controllers
{
    [Route("api/externalauth")]
    [ApiController]
    public class ExternalAuthController : ControllerBase
    {
        private readonly IExternalAuthRepository _externalAuthRepository;
        private readonly ILogger<ExternalAuthController> _logger;

        public ExternalAuthController(IExternalAuthRepository externalAuthRepository, ILogger<ExternalAuthController> logger)
        {
            _externalAuthRepository = externalAuthRepository;
            _logger = logger;
        }

        [HttpGet("signin-google")]
        public IActionResult SignInWithGoogle()
        {
            var props = new AuthenticationProperties
            {
                RedirectUri = Url.Action(nameof(GoogleCallback)) // Callback URL
            };

            return Challenge(props, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!result.Succeeded || result.Principal == null)
            {
                _logger.LogError("Google callback failed.");
                return BadRequest("Google authentication failed.");
            }

            var info = new ExternalLoginInfo(
                result.Principal,
                GoogleDefaults.AuthenticationScheme,
                result.Principal.FindFirstValue(ClaimTypes.NameIdentifier),
                result.Principal.FindFirstValue(ClaimTypes.Email)
            );

            var loginResponse = await _externalAuthRepository.HandleExternalLoginAsync(info);

            if (loginResponse == null)
            {
                return Unauthorized("External login failed.");
            }

            // Redirect về frontend với token
            return Redirect($" http://localhost:5173/auth/callback?token={loginResponse.AccessToken}&refreshToken={loginResponse.RefreshToken}");
        }

        // =================== FACEBOOK ===================

        [HttpGet("signin-facebook")]
        public IActionResult SignInWithFacebook()
        {
            var props = new AuthenticationProperties
            {
                RedirectUri = Url.Action(nameof(FacebookCallback)) // Callback URL
            };

            return Challenge(props, FacebookDefaults.AuthenticationScheme);
        }

        [HttpGet("facebook-callback")]
        public async Task<IActionResult> FacebookCallback()
        {
            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!result.Succeeded || result.Principal == null)
            {
                _logger.LogError("Facebook callback failed.");
                return BadRequest("Facebook authentication failed.");
            }

            var info = new ExternalLoginInfo(
                result.Principal,
                FacebookDefaults.AuthenticationScheme,
                result.Principal.FindFirstValue(ClaimTypes.NameIdentifier),
                result.Principal.FindFirstValue(ClaimTypes.Email)
            );

            var loginResponse = await _externalAuthRepository.HandleExternalLoginAsync(info);

            if (loginResponse == null)
            {
                return Unauthorized("External login failed.");
            }

            // Redirect về frontend với token
            return Redirect($" http://localhost:5173/auth/callback?token={loginResponse.AccessToken}&refreshToken={loginResponse.RefreshToken}");
        }
    }
}
