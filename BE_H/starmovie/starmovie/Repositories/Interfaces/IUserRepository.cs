using starmovie.Data;
using starmovie.Models;

namespace starmovie.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<UserDTO>> GetAllUsersAsync();
        Task<UserDTO> GetUserByIdAsync(string userId);
        Task<UserDTO> CreateUserAsync(UserDTO userDto);
        Task<UserDTO> UpdateUserAsync(string userId, UserDTO userDto);
        Task<bool> DeleteUserAsync(string userId);
        Task<bool> IsPhoneNumberExistsAsync(string phoneNumber);
        Task<bool> IsEmailExistsAsync(string email);
        Task<bool> IsEmailExistsForUpdateAsync(string email, string userId);
        Task<UserDTO> GetUserByUsernameAsync(string username);
        Task<UserDTO> RegisterUserAsync(RegisterDTO registerDTO);
        Task<LoginResponse> LoginUserAsync(LoginDTO loginDTO);
        Task<bool> ResetPasswordAsync(string email, string newPassword);
        Task<bool> ChangePasswordAsync(string userId, string password, string newPassword);
        Task<bool> VerifyPasswordAsync(string userId, string password);
        Task<ApplicationUser?> GetUserByRefreshTokenAsync(string refreshToken);
        Task UpdateRefreshTokenAsync(string userId, string refreshToken, DateTime expiry);
        Task LogoutAsync(string userId);

    }
}