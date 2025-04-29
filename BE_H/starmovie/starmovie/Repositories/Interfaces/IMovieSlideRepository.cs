using starmovie.Data.Domain;
using starmovie.Models;

namespace starmovie.Repositories.Interfaces
{
    public interface IMovieSlideRepository
    {
        Task<IEnumerable<MovieSlide>> GetAllMovieSlidesAsync();
        Task<IEnumerable<MovieSlide>> GetMovieSlidesByMovieIdAsync(int id);
        Task<MovieSlide> GetMovieSlideByIdAsync(int id);
        Task AddMovieSlideAsync(MovieSlide slide);
        Task<MovieSlide> UpdateMovieSlideAsync(MovieSlide slide);
        Task DeleteMovieSlideAsync(int id);
        Task<bool> MovieSlideExistsAsync(int id);
    }
}
