using AutoMapper;
using Microsoft.EntityFrameworkCore;
using starmovie.Data;
using starmovie.Data.Domain;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace starmovie.Repositories.Implementations
{
    public class MovieRepository : IMovieRepository
    {
        private readonly MovieContext _context;
        private readonly IMapper _mapper;

        public MovieRepository(MovieContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<MovieDTO>> GetAllMoviesAsync()
        {
            var movies = await _context.Movies
                .Include(m => m.MovieGenres).ThenInclude(mg => mg.Genre)
                .Include(m => m.MovieCategories).ThenInclude(mc => mc.Category)
                .AsNoTracking()
                .ToListAsync();

            return _mapper.Map<IEnumerable<MovieDTO>>(movies);
        }

        public async Task<Movie> GetMovieByIdAsync(int id)
        {
            var movie = await _context.Movies
                .Include(m => m.MovieGenres).ThenInclude(mg => mg.Genre)
                .Include(m => m.MovieCategories).ThenInclude(mc => mc.Category)
                .AsNoTracking()
                .FirstOrDefaultAsync(m => m.MovieID == id);
            if (movie == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy phim với ID: {id}");
            }
            return movie;
        }

        public async Task AddMovieAsync(Movie movie)
        {
            if (movie == null || string.IsNullOrWhiteSpace(movie.Title))
            {
                throw new ArgumentException("Tiêu đề phim không được để trống.");
            }

            // Đảm bảo các thể loại & danh mục không bị theo dõi trước khi thêm
            if (movie.MovieGenres != null)
            {
                foreach (var genre in movie.MovieGenres)
                {
                    _context.Entry(genre).State = EntityState.Detached;
                }
            }

            if (movie.MovieCategories != null)
            {
                foreach (var category in movie.MovieCategories)
                {
                    _context.Entry(category).State = EntityState.Detached;
                }
            }

            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();
        }

        public async Task<MovieDTO> UpdateMovieAsync(Movie movie)
        {
            if (movie == null)
                throw new ArgumentException("Dữ liệu phim không hợp lệ.");

            var existingMovie = await _context.Movies
                .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                .Include(m => m.MovieCategories)
                    .ThenInclude(mc => mc.Category)
                .FirstOrDefaultAsync(m => m.MovieID == movie.MovieID);

            if (existingMovie == null)
                throw new KeyNotFoundException($"Không tìm thấy phim với ID: {movie.MovieID}");

            // Cập nhật thông tin cơ bản
            _context.Entry(existingMovie).CurrentValues.SetValues(movie);

            // ✅ Cập nhật danh sách thể loại (MovieGenres)
            var newGenres = movie.MovieGenres?.Select(g => g.GenreID).ToHashSet() ?? new HashSet<int>();
            existingMovie.MovieGenres.RemoveAll(g => !newGenres.Contains(g.GenreID));
            foreach (var genre in movie.MovieGenres ?? new List<Movie_Genre>())
            {
                if (!existingMovie.MovieGenres.Any(g => g.GenreID == genre.GenreID))
                    existingMovie.MovieGenres.Add(new Movie_Genre { MovieID = movie.MovieID, GenreID = genre.GenreID });
            }

            // ✅ Cập nhật danh sách danh mục (MovieCategories)
            var newCategories = movie.MovieCategories?.Select(c => c.CategoryID).ToHashSet() ?? new HashSet<int>();
            existingMovie.MovieCategories.RemoveAll(c => !newCategories.Contains(c.CategoryID));
            foreach (var category in movie.MovieCategories ?? new List<Movie_Category>())
            {
                if (!existingMovie.MovieCategories.Any(c => c.CategoryID == category.CategoryID))
                    existingMovie.MovieCategories.Add(new Movie_Category { MovieID = movie.MovieID, CategoryID = category.CategoryID });
            }

            await _context.SaveChangesAsync();
            return _mapper.Map<MovieDTO>(existingMovie);
        }



        public async Task DeleteMovieAsync(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie != null)
            {
                _context.Movies.Remove(movie);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> MovieExistsAsync(int id)
        {
            return await _context.Movies.AnyAsync(m => m.MovieID == id);
        }

        public async Task<List<MovieDTO>> GetMoviesPagedAsync(int pageNumber, int pageSize)
        {
            var movies = await _context.Movies
                .Include(m => m.MovieGenres).ThenInclude(mg => mg.Genre)
                .Include(m => m.MovieCategories).ThenInclude(mc => mc.Category)
                .AsNoTracking()
                .OrderBy(m => m.MovieID)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return _mapper.Map<List<MovieDTO>>(movies);
        }

        public async Task<int> GetTotalMoviesAsync()
        {
            return await _context.Movies.CountAsync();
        }
    }
}
