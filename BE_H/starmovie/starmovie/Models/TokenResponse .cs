using System.Text.Json.Serialization;

namespace starmovie.Models
{
    public class TokenResponse
    {
        [JsonPropertyName("accessToken")]
        public string AccessToken { get; set; } = default!;
        [JsonPropertyName("refreshToken")]
        public string RefreshToken { get; set; } = default!;
    }

}