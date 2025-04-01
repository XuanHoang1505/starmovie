using System.Text.Json.Serialization;

namespace starmovie.Models
{
    public class MovieDTO
    {
        [JsonPropertyName("id")]
        public int MovieID { get; set; }
        [JsonPropertyName("title")]
        public string Title { get; set; }
        [JsonPropertyName("poster")]
        public string Poster { get; set; }
        [JsonPropertyName("description")]
        public string Description { get; set; }
        [JsonPropertyName("releaseDate")]
        public DateTime ReleaseDate { get; set; }
        [JsonPropertyName("rating")]
        [JsonNumberHandling(JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString)]
        public float Rating { get; set; }
        [JsonPropertyName("trailerUrl")]
        public string TrailerUrl { get; set; }
        [JsonPropertyName("genres")]
        public List<GenreDTO> Genres { get; set; }
        [JsonPropertyName("categories")]
        public List<CategoryDTO> Categories { get; set; }
    }
}
