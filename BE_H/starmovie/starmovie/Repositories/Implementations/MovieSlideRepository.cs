namespace starmovie.Repositories.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using starmovie.Data;
    using starmovie.Data.Domain;
    using starmovie.Repositories.Interfaces;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class MovieSlideRepository : IMovieSlideRepository
    {
        private readonly MovieContext _context;

        public MovieSlideRepository(MovieContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<MovieSlide>> GetAllMovieSlidesAsync()
        {
            return await _context.MovieSlides.ToListAsync();
        }

        public async Task AddMovieSlideAsync(MovieSlide slide)
        {
            if (slide == null)
            {
                throw new ArgumentNullException(nameof(slide), "Slide không được để trống.");
            }

            if (slide.Position <= 0)
            {
                throw new ArgumentException("Vị trí phải lớn hơn 0.", nameof(slide.Position));
            }
            _context.MovieSlides.Add(slide);
            await _context.SaveChangesAsync();
        }


        public async Task<bool> MovieSlideExistsAsync(int id)
        {
            return await _context.MovieSlides.AnyAsync(s => s.SlideID == id);
        }

        public async Task DeleteMovieSlideAsync(int id)
        {
            var slide = await _context.MovieSlides.FindAsync(id);
            if (slide != null)
            {
                _context.MovieSlides.Remove(slide);
                await _context.SaveChangesAsync();
            }
        }


        public async Task<MovieSlide> GetMovieSlideByIdAsync(int id)
        {
            return await _context.MovieSlides.FindAsync(id);
        }



        public async Task<MovieSlide> UpdateMovieSlideAsync(MovieSlide slide)
        {
            _context.MovieSlides.Update(slide);
            await _context.SaveChangesAsync();

            return slide;
        }

        public async Task<IEnumerable<MovieSlide>> GetMovieSlidesByMovieIdAsync(int id)
        {
            if (id <= 0)
            {
                throw new ArgumentException("Id phim không hợp lệ.");
            }
            var slides = await _context.MovieSlides.
                  Where(s => s.MovieID == id).
                  ToListAsync();

            return slides;
        }


    }
}