using System.Text.Json.Serialization;

namespace starmovie.Models
{
    public class MovieSlideDTO
    {
        [JsonPropertyName("id")]
        public int SlideID { get; set; }
        [JsonPropertyName("position")]
        public int Position { get; set; }
        [JsonPropertyName("movieId")]
        public int MovieID { get; set; }
        [JsonPropertyName("movie")]
        public MovieDTO Movie { get; set; }
    }
}
