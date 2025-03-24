using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace starmovie.Data.Domain
{
    public class Genre
    {
        [Key]
        public int GenreID { get; set; }

        [Required, StringLength(20)]
        public string GenreName { get; set; }
    }
}
