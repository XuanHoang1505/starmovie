using starmovie.Data.Domain;
using starmovie.Models; // Import DTO

namespace starmovie.Repositories.Interfaces
{
    public interface IMovieRepository
    {
        Task<IEnumerable<MovieDTO>> GetAllMoviesAsync();
        Task<Movie> GetMovieByIdAsync(int id);
        Task AddMovieAsync(Movie movie);
        Task<MovieDTO> UpdateMovieAsync(Movie movie);
        Task DeleteMovieAsync(int id);
        Task<bool> MovieExistsAsync(int id);
        Task<List<MovieDTO>> GetMoviesPagedAsync(int pageNumber, int pageSize);
        Task<int> GetTotalMoviesAsync();
        Task<List<MovieRatingDTO>> GetTopRatedMoviesAsync(int topN);
    }
}
