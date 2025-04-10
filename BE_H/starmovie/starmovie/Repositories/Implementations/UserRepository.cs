using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using starmovie.Data;
using starmovie.Enums;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using starmovie.Services;
using starmovie.Utils;
using System.Security.Claims;

namespace starmovie.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly JwtTokenProvider _jwtTokenProvider;
        private readonly ISendMailService _emailService;
        private readonly MovieContext _context;

        public UserRepository(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            RoleManager<IdentityRole> roleManager,
            IMapper mapper,
            JwtTokenProvider jwtTokenProvider,
            ISendMailService emailService,
            MovieContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
            _mapper = mapper;
            _jwtTokenProvider = jwtTokenProvider;
            _emailService = emailService;
            _context = context;
        }

        public async Task<IEnumerable<UserDTO>> GetAllUsersAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            var userDtos = new List<UserDTO>();

            foreach (var user in users)
            {
                var userDto = _mapper.Map<UserDTO>(user);
                userDto.Role = await GetUserRoleAsync(user);
                userDtos.Add(userDto);
            }

            return userDtos;
        }

        public async Task<UserDTO> GetUserByIdAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return null;

            var userDto = _mapper.Map<UserDTO>(user);
            userDto.Role = await GetUserRoleAsync(user);
            return userDto;
        }
        private string GenerateRandomPassword(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }


        public async Task<UserDTO> CreateUserAsync(UserDTO userDto)
        {
            var user = _mapper.Map<ApplicationUser>(userDto);
            user.Id = Guid.NewGuid().ToString();
            user.RegisterDate = DateTime.UtcNow;
            user.Status = UserStatus.ACTIVE;
            user.UserName = userDto.Email;

            var defaultPassword = GenerateRandomPassword(8);

            var result = await _userManager.CreateAsync(user, defaultPassword);
            if (!result.Succeeded) return null;

            if (!string.IsNullOrEmpty(userDto.Role))
            {
                await _userManager.AddToRoleAsync(user, userDto.Role);
            }
            SendEmail(userDto, defaultPassword);
            var createdDto = _mapper.Map<UserDTO>(user);
            createdDto.Role = await GetUserRoleAsync(user);
            return createdDto;
        }

        public async Task<UserDTO> UpdateUserAsync(string userId, UserDTO userDto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return null;

            _mapper.Map(userDto, user);
            await _userManager.UpdateAsync(user);

            // Cập nhật vai trò nếu có
            if (!string.IsNullOrEmpty(userDto.Role))
            {
                var currentRoles = await _userManager.GetRolesAsync(user);
                if (!currentRoles.Contains(userDto.Role))
                {
                    await _userManager.RemoveFromRolesAsync(user, currentRoles);
                    await _userManager.AddToRoleAsync(user, userDto.Role);
                }
            }
            var updatedDto = _mapper.Map<UserDTO>(user);
            updatedDto.Role = await GetUserRoleAsync(user);
            return updatedDto;
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }

        public async Task<bool> IsPhoneNumberExistsAsync(string phoneNumber)
        {
            return await _userManager.Users.AnyAsync(u => u.PhoneNumber == phoneNumber);
        }

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            return await _userManager.Users.AnyAsync(u => u.Email == email);
        }

        public async Task<bool> IsEmailExistsForUpdateAsync(string email, string userId)
        {
            return await _userManager.Users.AnyAsync(u => u.Email == email && u.Id != userId);
        }

        public async Task<UserDTO> GetUserByUsernameAsync(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return null;

            var userDto = _mapper.Map<UserDTO>(user);
            userDto.Role = await GetUserRoleAsync(user);
            return userDto;
        }

        public async Task<UserDTO> RegisterUserAsync(RegisterDTO registerDTO)
        {
            var user = new ApplicationUser
            {
                FullName = registerDTO.FullName,
                Email = registerDTO.Email,
                UserName = registerDTO.Email,
                RegisterDate = DateTime.UtcNow,
                Status = UserStatus.ACTIVE
            };

            var result = await _userManager.CreateAsync(user, registerDTO.Password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    Console.WriteLine($"Lỗi tạo người dùng: {error.Code} - {error.Description}");
                }
                return null;
            }


            // Gán role mặc định "User"
            await _userManager.AddToRoleAsync(user, "USER");

            var registeredDto = _mapper.Map<UserDTO>(user);
            registeredDto.Role = await GetUserRoleAsync(user);
            return registeredDto;
        }

        public async Task<LoginResponse> LoginUserAsync(LoginDTO loginDTO)
        {
            var user = await _userManager.FindByNameAsync(loginDTO.UserName);
            if (user == null) return new LoginResponse { AccessToken = null };

            var result = await _signInManager.PasswordSignInAsync(user, loginDTO.Password, false, false);
            if (result.Succeeded)
            {
                user.LastLogin = DateTime.UtcNow;

                var roles = await _userManager.GetRolesAsync(user);
                var accessToken = _jwtTokenProvider.GenerateToken(user.UserName, roles.ToList(), user.Id);
                var refreshToken = _jwtTokenProvider.GenerateRefreshToken();

                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(10);

                await _userManager.UpdateAsync(user);

                return new LoginResponse
                {
                    UserId = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Avatar = user.Avatar,
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                };
            }

            return new LoginResponse { AccessToken = null };
        }

        public async Task<bool> ResetPasswordAsync(string email, string newPassword)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return false;

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
            SendEmailNotification(user);
            return result.Succeeded;
        }

        public async Task<bool> ChangePasswordAsync(string userId, string password, string newPassword)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var result = await _userManager.ChangePasswordAsync(user, password, newPassword);
            return result.Succeeded;
        }

        public async Task<bool> VerifyPasswordAsync(string userId, string password)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            return await _userManager.CheckPasswordAsync(user, password);
        }

        private async Task<string> GetUserRoleAsync(ApplicationUser user)
        {
            var roles = await _userManager.GetRolesAsync(user);
            return roles.FirstOrDefault();
        }

        private void SendEmail(UserDTO userDTO, String defaultPassword)
        {

            string emailSubject = "Tài khoản của bạn đã được tạo thành công";

            string emailBody = "<html>" +
                    "<head>" +
                    "<style>" +
                    "    body { font-family: Arial, sans-serif; line-height: 1.6; }" +
                    "    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }"
                    +
                    "    h1 { color: #333; }" +
                    "    .info { background-color: #f9f9f9; padding: 15px; border: 1px solid #e1e1e1; border-radius: 5px; }"
                    +
                    "    .footer { margin-top: 20px; font-size: 0.9em; color: #666; text-align: center; }" +
                    "    .footer strong { color: #333; }" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "    <div class='container'>" +
                    "        <div style='text-align: center; margin-bottom: 20px;'>" +
                    "            <img src='https://res.cloudinary.com/da0i2y1qu/image/upload/v1731420581/logoVertical_q1nbbl.png' alt='Hight Star Logo' style='width: 150px; height: auto;' />"
                    +
                    "        </div>" +
                    "        <h1>Kính gửi " + userDTO.FullName + ",</h1>" +
                    "        <p>Chúng tôi vui mừng thông báo rằng tài khoản của bạn đã được tạo thành công. "
                    +
                    "        Dưới đây là thông tin đăng nhập của bạn:</p>" +
                    "        <div class='info'>" +
                    "            <strong>Tên đăng nhập:</strong> " + userDTO.Email + "<br>" +
                    "            <strong>Mật khẩu:</strong> " + defaultPassword +
                    "        </div>" +
                    "        <p>Vui lòng đăng nhập và thay đổi mật khẩu ngay khi có thể để đảm bảo an toàn cho tài khoản của bạn.</p>"
                    +
                    "        <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>" +
                    "        <div class='footer'>" +
                    "            <p>Chân thành cảm ơn bạn,<br><strong>Đội ngũ hỗ trợ khách hàng</strong></p>"
                    +
                    "            <p><strong>Star Movie</strong><br>" +
                    "            Email: starmovieteam@gmail.com | Hotline: 0888-372-325</p>" +
                    "            <p>Đây là email tự động từ phần mềm Star Movie. Vui lòng không trả lời email này.</p>"
                    +
                    "        </div>" +
                    "    </div>" +
                    "</body>" +
                    "</html>";

            _emailService.SendEmailAsync(userDTO.Email, emailSubject, emailBody);
        }

        private void SendEmailNotification(ApplicationUser user)
        {

            string emailSubject = "Mật khẩu của bạn đã được thay đổi thành công";

            string emailBody = "<html>" +
                    "<head>" +
                    "<style>" +
                    "    body { font-family: Arial, sans-serif; line-height: 1.6; }" +
                    "    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }"
                    +
                    "    h1 { color: #333; }" +
                    "    .info { background-color: #f9f9f9; padding: 15px; border: 1px solid #e1e1e1; border-radius: 5px; }"
                    +
                    "    .footer { margin-top: 20px; font-size: 0.9em; color: #666; text-align: center; }" +
                    "    .footer strong { color: #333; }" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "    <div class='container'>" +
                    "        <div style='text-align: center; margin-bottom: 20px;'>" +
                    "            <img src='https://res.cloudinary.com/da0i2y1qu/image/upload/v1731420581/logoVertical_q1nbbl.png' alt='Hight Star Logo' style='width: 150px; height: auto;' />"
                    +
                    "        </div>" +
                    "        <h1>Kính gửi bạn,</h1>" +
                    "        <p>Chúng tôi xin thông báo rằng mật khẩu tài khoản của bạn đã được thay đổi thành công. Nếu bạn không yêu cầu thay đổi mật khẩu này, vui lòng liên hệ ngay với chúng tôi để đảm bảo an toàn cho tài khoản của bạn.</p>"
                    +
                    "        <div class='info'>" +
                    "            <p><strong>Tên đăng nhập:</strong> " + user.UserName + "</p>" +
                    "        </div>" +
                    "        <p>Nếu bạn cần hỗ trợ thêm, đừng ngần ngại liên hệ với chúng tôi qua thông tin bên dưới.</p>" +
                    "        <div class='footer'>" +
                    "            <p>Chân thành cảm ơn bạn,<br><strong>Đội ngũ hỗ trợ khách hàng</strong></p>" +
                    "            <p><strong>Star Movie</strong><br>" +
                    "            Email: starmovieteam@gmail.com | Hotline: 0888-372-325</p>" +
                    "            <p>Đây là email tự động từ phần mềm Star Movie. Vui lòng không trả lời email này.</p>" +
                    "        </div>" +
                    "    </div>" +
                    "</body>" +
                    "</html>";

            _emailService.SendEmailAsync(user.Email, emailSubject, emailBody);
        }

        public async Task<ApplicationUser?> GetUserByRefreshTokenAsync(string refreshToken)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
        }

        public async Task UpdateRefreshTokenAsync(string userId, string refreshToken, DateTime expiry)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return;

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = expiry;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task LogoutAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return;

            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await _userManager.UpdateAsync(user);
        }
    }
}

