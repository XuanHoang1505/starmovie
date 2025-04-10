using System.Text.Json.Serialization;

namespace starmovie.Models
{
    public class LogoutDTO
    {
        [JsonPropertyName("id")]
        public string UserId { get; set; }
    }
}