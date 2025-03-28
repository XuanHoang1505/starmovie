using System.Text.Json.Serialization;

namespace starmovie.Models
{
    public class GenreDTO
    {
        [JsonPropertyName("id")]
        public int GenreID { get; set; }

        [JsonPropertyName("genreName")]
        public required string Name { get; set; }
    }
}
