using AutoMapper;
using Microsoft.EntityFrameworkCore;
using starmovie.Data;
using starmovie.Data.Domain;
using starmovie.Helpers;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace starmovie.Repositories.Implementations
{
    public class GenreRepository : IGenreRepository
    {
        private readonly MovieContext _context;
        private readonly IMapper _mapper;

        public GenreRepository(MovieContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<Genre>> GetAllGenresAsync()
        {
            return await _context.Genres.ToListAsync();
        }

        public async Task<Genre> GetGenreByIdAsync(int id)
        {
            return await _context.Genres.FindAsync(id);
        }

        public async Task AddGenreAsync(Genre genre)
        {
            if (genre == null || string.IsNullOrWhiteSpace(genre.GenreName))
            {
                throw new ArgumentException("Genre name cannot be null or empty.");
            }

            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();
        }


        public async Task<GenreDTO> UpdateGenreAsync(Genre genre)
        {
            _context.Genres.Update(genre);
            await _context.SaveChangesAsync();

            return _mapper.Map<GenreDTO>(genre);
        }

        public async Task DeleteGenreAsync(int id)
        {
            var genre = await _context.Genres.FindAsync(id);
            if (genre != null)
            {
                _context.Genres.Remove(genre);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<Genre>> GetGenresPagedAsync(int pageNumber, int pageSize)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10; // Giá trị mặc định

            return await _context.Genres
                .AsNoTracking()
                .OrderBy(g => g.GenreID)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }


        public async Task<bool> GenreExistsAsync(string name)
        {
            return await _context.Genres.AnyAsync(g => g.GenreName == name);
        }
        public async Task<int> GetTotalGenresAsync()
        {
            return await _context.Genres.CountAsync();
        }

    }
}
