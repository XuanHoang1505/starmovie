using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Facebook;
using Microsoft.Extensions.Logging;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using starmovie.Utils;
using System.Linq;
using System.Threading.Tasks;
using starmovie.Data;
using System.Security.Claims;
namespace starmovie.Repositories.Implementations
{

    public class ExternalAuthRepository : IExternalAuthRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtTokenProvider _jwtTokenProvider;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<ExternalAuthRepository> _logger;

        public ExternalAuthRepository(
            UserManager<ApplicationUser> userManager,
            JwtTokenProvider jwtTokenProvider,
            IUserRepository userRepository,
            ILogger<ExternalAuthRepository> logger)
        {
            _userManager = userManager;
            _jwtTokenProvider = jwtTokenProvider;
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<LoginResponse?> HandleExternalLoginAsync(ExternalLoginInfo info)
        {
            if (info == null)
            {
                _logger.LogError("External login info is null.");
                return null;
            }

            // Kiểm tra xem người dùng đã tồn tại chưa
            var user = await _userManager.FindByEmailAsync(info.Principal.FindFirstValue(ClaimTypes.Email));

            if (user == null)
            {
                // Nếu người dùng chưa có, ta cần đăng ký mới
                var newUser = new ApplicationUser
                {
                    UserName = info.Principal.FindFirstValue(ClaimTypes.NameIdentifier),
                    Email = info.Principal.FindFirstValue(ClaimTypes.Email),
                    FullName = info.Principal.FindFirstValue(ClaimTypes.Name), // Cập nhật tên nếu có
                    Avatar = info.Principal.FindFirstValue("picture"), // Đảm bảo lấy avatar nếu có từ Google/Facebook
                    RegisterDate = DateTime.Now,
                    LastLogin = DateTime.Now,

                };

                var result = await _userManager.CreateAsync(newUser);
                if (!result.Succeeded)
                {
                    _logger.LogError("Error creating new user during external login.");
                    return null;
                }

                // Gán vai trò mặc định là USER
                var roleResult = await _userManager.AddToRoleAsync(newUser, "USER");
                if (!roleResult.Succeeded)
                {
                    _logger.LogError("Error assigning default role USER to the new user.");
                    return null;
                }

                // Sau khi tạo người dùng và gán vai trò, tiếp tục thực hiện đăng nhập
                user = newUser;
            }

            // Đăng nhập người dùng
            await _userManager.AddLoginAsync(user, info);

            var roles = await _userManager.GetRolesAsync(user);
            var accessToken = _jwtTokenProvider.GenerateToken(user.UserName, roles.ToList(), user.Id);
            var refreshToken = "Bearer " + _jwtTokenProvider.GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(10);
            await _userManager.UpdateAsync(user);

            return new LoginResponse
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Avatar = user.Avatar,
                Role = roles.FirstOrDefault() ?? "USER",
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

    }
}