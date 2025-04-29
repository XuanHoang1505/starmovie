using System.Text.Json.Serialization;

namespace starmovie.Models
{
    public class ResetPasswordDTO
    {
        [JsonPropertyName("email")]
        public string Email { get; set; }
        [JsonPropertyName("newPassword")]
        public string NewPassword { get; set; }
    }

}