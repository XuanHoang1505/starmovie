using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using starmovie.Data;
using starmovie.Models;
using starmovie.Repositories.Interfaces;

namespace starmovie.Utils
{
    public class JwtTokenProvider
    {
        private readonly string _jwtSecretKey;
        private readonly int _jwtExpiration;
        private readonly int _refreshTokenExpiration;

        private readonly UserManager<ApplicationUser> _userManager;
        public JwtTokenProvider(IConfiguration configuration, UserManager<ApplicationUser> userManager)
        {
            _jwtSecretKey = configuration["JWT:Secret"] ?? throw new Exception("JWT Secret Key không được tìm thấy.");
            _jwtExpiration = int.Parse(configuration["JWT:ExpirationInMinutes"] ?? "60"); // 60 phút mặc định
            _refreshTokenExpiration = int.Parse(configuration["JWT:RefreshExpirationInDays"] ?? "30"); // 30 ngày mặc định
            _userManager = userManager;
        }

        // Tạo JWT Token
        public string GenerateToken(string username, List<string> roles, string userId)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("userId", userId.ToString())
            };

            // Thêm danh sách quyền (roles)
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityToken(
                issuer: "starmovie.com",
                audience: "StarMovieUsers",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_jwtExpiration),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Tạo Refresh Token
        public string GenerateRefreshToken()
        {
            var randomBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes);
        }

        // Lấy Username từ JWT Token
        public string GetUsernameFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);
            return jwtToken?.Subject;
        }

        // Xác minh JWT Token
        public bool ValidateToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_jwtSecretKey);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = "starmovie.com",
                    ValidAudience = "StarMovieUsers",
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out _);

                return true;
            }
            catch
            {
                return false;
            }
        }
        public TokenResponse GenerateTokenPair(string username, List<string> roles, string userId)
        {
            string accessToken = GenerateToken(username, roles, userId);
            string refreshToken = GenerateRefreshToken();

            return new TokenResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }
        public async Task<string?> RefreshTokenAsync(string refreshToken, IUserRepository userRepository)
        {
            var user = await userRepository.GetUserByRefreshTokenAsync(refreshToken);
            if (user == null || user.RefreshTokenExpiryTime < DateTime.UtcNow)
                return null;
            var roles = await _userManager.GetRolesAsync(user);

            var newAccessToken = GenerateToken(user.UserName, roles.ToList(), user.Id);
            var newRefreshToken = GenerateRefreshToken();

            await userRepository.UpdateRefreshTokenAsync(user.Id, newRefreshToken, DateTime.UtcNow.AddDays(_refreshTokenExpiration));

            return newAccessToken;
        }

    }

}
