using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace starmovie.Data.Domain
{
    [PrimaryKey(nameof(MovieID), nameof(CategoryID))]
    public class Movie_Category
    {
        public int MovieID { get; set; }
        public int CategoryID { get; set; }
        [ForeignKey("MovieID")]
        public Movie Movie { get; set; }
        [ForeignKey("CategoryID")]
        public Category Category { get; set; }
    }
}