
using System.ComponentModel.DataAnnotations;

namespace starmovie.Data.Domain
{
    public class Movie
    {
        [Key]
        public int MovieID { get; set; }

        [Required, StringLength(100)]
        public string Title { get; set; }

        public string Description { get; set; }

        public DateTime ReleaseDate { get; set; }

        [StringLength(30)]
        public string Country { get; set; }

        public decimal Rating { get; set; }

        public TimeSpan Duration { get; set; }

        public ICollection<Movie_Genre> MovieGenres { get; set; }
        public ICollection<Movie_Actor> MovieActors { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<WatchHistory> WatchHistories { get; set; }
    }
}