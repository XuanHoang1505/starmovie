using System.Text.Json.Serialization;

namespace starmovie.Models
{
    public class CommentDTO
    {
        [JsonPropertyName("id")]
        public int? CommentID { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }

        public string UserId { get; set; }
        [JsonPropertyName("fullName")]

        public string? FullName { get; set; }

        public int EpisodeId { get; set; }
        public string? EpisodeTitle { get; set; }

        public string? MovieTitle { get; set; }

        public int? ParentCommentId { get; set; }
        public string? ParentContent { get; set; }
    }

}