using System.Text.Json.Serialization;

namespace starmovie.Models
{
    public class ActorDTO
    {
        [JsonPropertyName("id")]
        public int ActorID { get; set; }
        [JsonPropertyName("name")]
        public string ActorName { get; set; }
        [JsonPropertyName("avatar")]
        public string Avatar { get; set; }
        [JsonPropertyName("birthDate")]
        public string BirthDate { get; set; }
        [JsonPropertyName("nationality")]
        public string Nationality { get; set; }
    }
}