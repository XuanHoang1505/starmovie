namespace starmovie.Repositories.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using starmovie.Data;
    using starmovie.Data.Domain;
    using starmovie.Repositories.Interfaces;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class EpisodeRepository : IEpisodeRepository
    {
        private readonly MovieContext _context;

        public EpisodeRepository(MovieContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Episode>> GetAllEpisodesAsync()
        {
            return await _context.Episodes.ToListAsync();
        }

        public async Task AddEpisodeAsync(Episode episode)
        {
            if (episode == null || string.IsNullOrWhiteSpace(episode.EpisodeTitle))
            {
                throw new ArgumentException("Tên tập phim không được để trống.");
            }
            _context.Episodes.Add(episode);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> EpisodeExistsAsync(int id)
        {
            return await _context.Episodes.AnyAsync(e => e.EpisodeID == id);
        }

        public async Task DeleteEpisodeAsync(int id)
        {
            var episode = await _context.Episodes.FindAsync(id);
            if (episode != null)
            {
                _context.Episodes.Remove(episode);
                await _context.SaveChangesAsync();
            }
        }


        public async Task<List<Episode>> GetEpisodesPagedAsync(int pageNumber, int pageSize)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;

            return await _context.Episodes
                .AsNoTracking()
                .OrderBy(a => a.EpisodeID)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<Episode> GetEpisodeByIdAsync(int id)
        {
            return await _context.Episodes.FindAsync(id);
        }

        public async Task<int> GetTotalEpisodesAsync()
        {
            return await _context.Episodes.CountAsync();
        }

        public async Task<Episode> UpdateEpisodeAsync(Episode episode)
        {
            _context.Episodes.Update(episode);
            await _context.SaveChangesAsync();

            return episode;
        }

        public async Task<IEnumerable<Episode>> GetEpisodesByMovieIdAsync(int id)
        {
            if (id <= 0)
            {
                throw new ArgumentException("Id phim không hợp lệ.");
            }
            var episodes = await _context.Episodes.
                  Where(e => e.MovieID == id).
                  ToListAsync();

            return episodes;
        }


    }
}