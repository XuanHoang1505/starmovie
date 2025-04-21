using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using starmovie.Data;
using starmovie.Enums;
using starmovie.Repositories.Interfaces;
using starmovie.Services;
using starmovie.Utils;
using StarMovie.Utils.Exceptions;

namespace starmovie.Controllers
{
    [Route("api/admin/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly CloudinaryService _cloudinaryService;

        public UserController(IUserRepository userRepository, CloudinaryService cloudinaryService)
        {
            _userRepository = userRepository;
            _cloudinaryService = cloudinaryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(string id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null) return NotFound("Người dùng không tồn tại!");
            return Ok(user);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpGet("search-by-username")]
        public async Task<ActionResult<UserDTO>> GetUserByUsername([FromQuery] string username)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user == null) return NotFound("Người dùng không tồn tại!");
            return Ok(user);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<ActionResult<UserDTO>> CreateUser([FromBody] UserDTO userDto)
        {

            if (await _userRepository.IsEmailExistsAsync(userDto.Email))
                return BadRequest("Email đã tồn tại!");

            var createdUser = await _userRepository.CreateUserAsync(userDto);
            return Ok(createdUser);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDTO>> UpdateUser(string id, [FromForm] string user, [FromForm] IFormFile? file)
        {
            if (string.IsNullOrWhiteSpace(user))
                return BadRequest("Dữ liệu user không hợp lệ!");

            UserDTO userDto;
            try
            {
                userDto = JsonSerializer.Deserialize<UserDTO>(user);
            }
            catch (JsonException)
            {
                return BadRequest("Dữ liệu không hợp lệ!");
            }
            if (id != userDto.Id) return BadRequest("ID không hợp lệ!");

            try
            {
                var existingUser = await _userRepository.GetUserByIdAsync(id);
                if (existingUser == null) return NotFound("Người dùng không tồn tại!");
                if (file != null)
                {
                    if (!string.IsNullOrWhiteSpace(existingUser.Avatar))
                    {
                        string oldPublicId = CloudinaryService.ExtractPublicId(existingUser.Avatar);
                        await _cloudinaryService.DeleteImageAsync(oldPublicId);
                    }
                    string newImageUrl = await _cloudinaryService.UploadImageAsync(file, "user");
                    userDto.Avatar = newImageUrl;
                }
                else
                {
                    userDto.Avatar = existingUser.Avatar;
                }

                var updatedUser = await _userRepository.UpdateUserAsync(id, userDto);

                return Ok(updatedUser);
            }
            catch (AppException ex)
            {
                return StatusCode((int)ex.ErrorCode, new { error = ex.ErrorCode.ToString(), message = ex.Message });
            }
        }

        // [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var success = await _userRepository.DeleteUserAsync(id);
            if (!success) return NotFound("Người dùng không tồn tại!");
            return Ok("Người dùng đã bị xóa thành công!");
        }
    }
}