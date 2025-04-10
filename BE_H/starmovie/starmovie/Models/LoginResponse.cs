using System.Text.Json.Serialization;
namespace starmovie.Models
{

    public class LoginResponse
    {

        [JsonPropertyName("userId")]
        public string UserId { get; set; }

        [JsonPropertyName("fullName")]
        public string FullName { get; set; }

        [JsonPropertyName("email")]
        public string Email { get; set; }
        [JsonPropertyName("avatar")]
        public string Avatar { get; set; }

        [JsonPropertyName("accessToken")]
        public string AccessToken { get; set; }

        [JsonPropertyName("refreshToken")]
        public string RefreshToken { get; set; }


    }
}