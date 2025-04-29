using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace starmovie.Models
{
    public class ReviewDTO
    {
        [JsonPropertyName("id")]
        public int? ReviewID { get; set; }
        [JsonPropertyName("userId")]
        public string UserID { get; set; }
        [JsonPropertyName("movieId")]
        public int MovieID { get; set; }
        [JsonPropertyName("rating")]
        public int Rating { get; set; }
        [JsonPropertyName("comment")]

        [StringLength(255)]
        public string Comment { get; set; }
        [JsonPropertyName("timestamp")]
        public DateTime? Timestamp { get; set; }
        [JsonPropertyName("username")]
        public string? UserName { get; set; }
        [JsonPropertyName("movieTitle")]
        public string? MovieTitle { get; set; }
    }

}