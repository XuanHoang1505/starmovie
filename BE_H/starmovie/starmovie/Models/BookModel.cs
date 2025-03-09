using System.ComponentModel.DataAnnotations;

namespace starmovie.Models
{
    public class BookModel
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        [Range(0, double.MaxValue)]
        public double Price { get; set; }
        [Range(0, 100)]
        public int Quantity { get; set; }
    }
}
