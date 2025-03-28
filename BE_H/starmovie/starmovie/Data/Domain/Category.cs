using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace starmovie.Data.Domain
{
    public class Category
    {
        [Key]
        public int CategoryID { get; set; }
        [Required, StringLength(50)]
        public string CategoryName { get; set; }
        public List<Movie_Category> MovieCategories { get; set; }
    }

}