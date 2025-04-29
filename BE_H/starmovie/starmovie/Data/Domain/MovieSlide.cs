using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace starmovie.Data.Domain
{
    public class MovieSlide
    {
        [Key]
        public int SlideID { get; set; }
        [Required]
        public int Position { get; set; }
        public int MovieID { get; set; }
        [ForeignKey("MovieID")]
        public Movie? Movie { get; set; }
    }
}