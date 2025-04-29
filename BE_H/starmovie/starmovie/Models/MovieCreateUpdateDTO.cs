namespace starmovie.Models
{
    public class MovieCreateUpdateDTO
    {
        public string Movie { get; set; }
        public IFormFile? Trailer { get; set; }
        public IFormFile? Poster { get; set; }
    }

}