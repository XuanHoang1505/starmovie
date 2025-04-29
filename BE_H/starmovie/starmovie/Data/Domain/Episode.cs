using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace starmovie.Data.Domain
{
    public class Episode
    {
        [Key]
        public int EpisodeID { get; set; }
        [Required, StringLength(100)]
        public string EpisodeTitle { get; set; }
        [Required]
        public TimeSpan Duration { get; set; }
        [Required]
        public DateTime ReleaseDate { get; set; }
        [StringLength(255)]
        public string EpisodeImage { get; set; }
        [StringLength(255)]
        public string TrailerUrl { get; set; }
        [StringLength(255)]
        public string MovieUrl { get; set; }

        public int ViewCount { get; set; } = 0;
        public int MovieID { get; set; }
        [ForeignKey("MovieID")]
        public Movie Movie { get; set; }
        public List<Comment> Comments { get; set; }
        public List<WatchHistory> WatchHistories { get; set; }
    }
}