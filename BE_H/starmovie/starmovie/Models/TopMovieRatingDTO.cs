namespace starmovie.Models
{
    public class TopMovieRatingDTO
    {
        public string MovieName { get; set; }
        public double AverageRating { get; set; }
        public int TotalRatings { get; set; }
        public string PosterUrl { get; set; }
    }
}