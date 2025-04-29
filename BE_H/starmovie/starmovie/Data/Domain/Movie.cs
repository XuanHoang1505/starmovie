
using System.ComponentModel.DataAnnotations;

namespace starmovie.Data.Domain
{
    public class Movie
    {
        [Key]
        public int MovieID { get; set; }
        [Required, StringLength(100)]
        public string Title { get; set; }
        [Required, StringLength(255)]
        public string Poster { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public DateTime ReleaseDate { get; set; }
        public float Rating { get; set; }
        [StringLength(255)]
        public string TrailerUrl { get; set; }

        public List<Movie_Genre> MovieGenres { get; set; } = new List<Movie_Genre>();
        public List<Movie_Category> MovieCategories { get; set; } = new List<Movie_Category>();
        public List<Movie_Actor> MovieActors { get; set; } = new List<Movie_Actor>();
        public List<Episode> Episodes { get; set; } = new List<Episode>();
        public List<MovieSlide> MovieSlides { get; set; } = new List<MovieSlide>();
        public List<Review> Reviews { get; set; } = new List<Review>();
        public List<User_Movie_Favorite> FavoriteMovies { get; set; } = new List<User_Movie_Favorite>();
    }

}