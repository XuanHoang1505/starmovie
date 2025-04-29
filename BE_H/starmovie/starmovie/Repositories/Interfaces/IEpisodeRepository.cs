using starmovie.Data.Domain;
using starmovie.Models;

namespace starmovie.Repositories.Interfaces
{
    public interface IEpisodeRepository
    {
        Task<IEnumerable<Episode>> GetAllEpisodesAsync();
        Task<IEnumerable<Episode>> GetEpisodesByMovieIdAsync(int id);
        Task<Episode> GetEpisodeByIdAsync(int id);
        Task AddEpisodeAsync(Episode episode);
        Task<Episode> UpdateEpisodeAsync(Episode episode);
        Task DeleteEpisodeAsync(int id);

        Task<bool> EpisodeExistsAsync(int id);
        Task<List<Episode>> GetEpisodesPagedAsync(int pageNumber, int pageSize);

        Task<int> GetTotalEpisodesAsync();
    }
}
