namespace starmovie.Models
{
    public class EpisodeCreateUpdateDTO
    {
        public string Episode { get; set; }
        public IFormFile? Image { get; set; }
        public IFormFile? Trailer { get; set; }
        public IFormFile? EpisodeVideo { get; set; }
    }

}