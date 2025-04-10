using System.Text.Json.Serialization;
namespace starmovie.Models
{

    public class RegisterDTO
    {
        [JsonPropertyName("fullName")]
        public string FullName { get; set; }
        [JsonPropertyName("email")]
        public string Email { get; set; }

        [JsonPropertyName("password")]
        public string Password { get; set; }

        [JsonPropertyName("confirmPassword")]
        public string ConfirmPassword { get; set; }

    }
}