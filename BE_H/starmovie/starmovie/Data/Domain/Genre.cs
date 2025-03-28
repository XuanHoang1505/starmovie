using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace starmovie.Data.Domain
{
    public class Genre
    {
        [Key]
        public int GenreID { get; set; }
        [Required, StringLength(20)]
        public string GenreName { get; set; }
        [JsonIgnore]
        public List<Movie_Genre> MovieGenres { get; set; }
    }

}
