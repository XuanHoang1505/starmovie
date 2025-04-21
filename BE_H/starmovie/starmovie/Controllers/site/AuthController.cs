using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using starmovie.Services;
using starmovie.Utils;
using System.Threading.Tasks;

namespace starmovie.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtTokenProvider _jwtTokenProvider;
        private readonly OtpService _otpService;

        public AuthController(
            IUserRepository userRepository,
            JwtTokenProvider jwtTokenProvider,
            OtpService otpService)
        {
            _userRepository = userRepository;
            _jwtTokenProvider = jwtTokenProvider;
            _otpService = otpService;
        }

        // Đăng nhập
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            var response = await _userRepository.LoginUserAsync(loginDTO);
            if (response?.AccessToken == null)
                return Unauthorized("Sai thông tin đăng nhập.");

            // Thêm AccessToken vào header
            Response.Headers.Add("Authorization", $"Bearer {response.AccessToken}");

            return Ok(response);
        }

        // Đăng ký
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDTO registerDTO)
        {
            var result = await _userRepository.RegisterUserAsync(registerDTO);
            if (result == null)
                return BadRequest("Đăng ký thất bại. Vui lòng thử lại.");
            return Ok(result);
        }

        [HttpPost("verify-password")]
        public async Task<IActionResult> VerifyPassword([FromBody] VerifyPasswordDTO dto)
        {
            var isValid = await _userRepository.VerifyPasswordAsync(dto.UserId, dto.Password);
            if (!isValid)
                return BadRequest("Mật khẩu không đúng.");
            return Ok("Mật khẩu hợp lệ.");
        }

        // Đổi mật khẩu
        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO dto)
        {
            var success = await _userRepository.ChangePasswordAsync(dto.UserId, dto.CurrentPassword, dto.NewPassword);
            if (!success)
                return BadRequest("Thay đổi mật khẩu thất bại.");
            return Ok("Thay đổi mật khẩu thành công.");
        }

        // Quên mật khẩu
        [Authorize]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
        {
            var success = await _userRepository.ResetPasswordAsync(dto.Email, dto.NewPassword);
            if (!success)
                return BadRequest("Không thể đặt lại mật khẩu.");
            return Ok("Đặt lại mật khẩu thành công.");
        }

        // Gửi OTP
        [HttpPost("send-otp")]
        public IActionResult SendOtp([FromBody] SendOtpDTO dto)
        {
            try
            {
                string otp = _otpService.SendOtp(dto.Identifier);
                return Ok(new { Message = "OTP đã được gửi thành công." });
            }
            catch
            {
                return BadRequest("Không thể gửi OTP.");
            }
        }

        // Gửi lại OTP
        [HttpPost("resend-otp")]
        public IActionResult ResendOtp([FromBody] SendOtpDTO dto)
        {
            try
            {
                // Gửi OTP mới
                string otp = _otpService.SendOtp(dto.Identifier);
                return Ok(new { Message = "OTP mới đã được gửi thành công." });
            }
            catch
            {
                return BadRequest("Không thể gửi lại OTP.");
            }
        }


        // Xác thực OTP
        [HttpPost("verify-otp")]
        public IActionResult VerifyOtp([FromBody] VerifyOtpDTO dto)
        {
            var isValid = _otpService.ValidateOtp(dto.Identifier, dto.Otp);
            if (!isValid)
                return BadRequest("OTP không đúng hoặc đã hết hạn.");
            return Ok("Xác thực OTP thành công.");
        }

        // Làm mới token - nếu bạn có thêm hàm này trong JwtTokenProvider
        [Authorize]
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var newAccessToken = await _jwtTokenProvider.RefreshTokenAsync(refreshToken, _userRepository);

            if (newAccessToken != null)
                return Ok(new { AccessToken = newAccessToken });

            return Unauthorized("Refresh token không hợp lệ hoặc đã hết hạn.");
        }


        // Đăng xuất
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutDTO logoutDTO)
        {
            await _userRepository.LogoutAsync(logoutDTO.UserId);
            return Ok("Đăng xuất thành công.");
        }
    }
}
