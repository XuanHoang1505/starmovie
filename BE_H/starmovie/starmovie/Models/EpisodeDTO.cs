using System.Text.Json.Serialization;
namespace starmovie.Models
{
    public class EpisodeDTO
    {
        [JsonPropertyName("id")]
        public int EpisodeID { get; set; }
        [JsonPropertyName("episodeTitle")]
        public string EpisodeTitle { get; set; }
        [JsonPropertyName("duration")]
        public string Duration { get; set; }
        [JsonPropertyName("releaseDate")]
        public DateTime ReleaseDate { get; set; }
        [JsonPropertyName("image")]
        public string EpisodeImage { get; set; }
        [JsonPropertyName("trailerUrl")]
        public string TrailerUrl { get; set; }
        [JsonPropertyName("movieUrl")]
        public string MovieUrl { get; set; }
        [JsonPropertyName("view")]
        public int ViewCount { get; set; }
        [JsonPropertyName("movieId")]
        public int MovieID { get; set; }
        [JsonPropertyName("movieTitle")]
        public string MovieTitle { get; set; }

    }
}