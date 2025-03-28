using starmovie.Data.Domain;
using starmovie.Models;

namespace starmovie.Repositories.Interfaces
{
    public interface IGenreRepository
    {
        Task<IEnumerable<Genre>> GetAllGenresAsync();
        Task<Genre> GetGenreByIdAsync(int id);
        Task AddGenreAsync(Genre genre);
        Task<Genre> UpdateGenreAsync(Genre genre);
        Task DeleteGenreAsync(int id);

        Task<bool> GenreExistsAsync(string name);
        Task<List<Genre>> GetGenresPagedAsync(int pageNumber, int pageSize);

        Task<int> GetTotalGenresAsync();
    }
}
