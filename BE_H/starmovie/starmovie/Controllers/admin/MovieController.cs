using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using starmovie.Data.Domain;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using starmovie.Services;
using Microsoft.AspNetCore.Authorization;

namespace starmovie.Controllers.admin
{
    [Route("api/admin/movies")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private readonly IMovieRepository _movieRepository;
        private readonly IMapper _mapper;
        private readonly CloudinaryService _cloudinaryService;

        public MovieController(IMovieRepository movieRepository, IMapper mapper, CloudinaryService cloudinaryService)
        {
            _mapper = mapper;
            _movieRepository = movieRepository;
            _cloudinaryService = cloudinaryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieDTO>>> GetMovies()
        {
            var movies = await _movieRepository.GetAllMoviesAsync();
            return Ok(_mapper.Map<IEnumerable<MovieDTO>>(movies));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MovieDTO>> GetMovie(int id)
        {
            var movie = await _movieRepository.GetMovieByIdAsync(id);
            if (movie == null) return NotFound();
            return Ok(_mapper.Map<MovieDTO>(movie));
        }
        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<ActionResult> CreateMovie([FromForm] MovieCreateUpdateDTO movieCreateDTO)
        {
            if (string.IsNullOrWhiteSpace(movieCreateDTO.Movie))
                return BadRequest("Dữ liệu phim không hợp lệ!");

            MovieDTO movieDto;
            try
            {
                movieDto = JsonSerializer.Deserialize<MovieDTO>(movieCreateDTO.Movie);
            }
            catch (Exception ex)
            {
                return BadRequest($"Dữ liệu phim không hợp lệ! Lỗi: {ex.Message}");
            }

            if (await _movieRepository.MovieExistsAsync(movieDto.MovieID))
                return BadRequest("Phim đã tồn tại!");

            var movieEntity = new Movie
            {
                Title = movieDto.Title,
                Description = movieDto.Description,
                ReleaseDate = movieDto.ReleaseDate,
                Rating = movieDto.Rating,
                TrailerUrl = movieDto.TrailerUrl,
                Poster = movieDto.Poster,
                MovieGenres = new List<Movie_Genre>(),
                MovieCategories = new List<Movie_Category>()
            };

            if (movieCreateDTO.Trailer != null)
            {
                movieEntity.TrailerUrl = await _cloudinaryService.UploadVideoAsync(movieCreateDTO.Trailer, "movie_trailer");
            }

            if (movieCreateDTO.Poster != null)
            {
                movieEntity.Poster = await _cloudinaryService.UploadImageAsync(movieCreateDTO.Poster, "movie_poster");
            }

            if (movieDto.Genres != null && movieDto.Genres.Any())
            {
                movieEntity.MovieGenres = movieDto.Genres.Select(g => new Movie_Genre
                {
                    GenreID = g.GenreID,
                    Movie = movieEntity
                }).ToList();
            }

            if (movieDto.Categories != null && movieDto.Categories.Any())
            {
                movieEntity.MovieCategories = movieDto.Categories.Select(c => new Movie_Category
                {
                    CategoryID = c.CategoryID,
                    Movie = movieEntity
                }).ToList();
            }

            await _movieRepository.AddMovieAsync(movieEntity);

            // Nạp lại Movie từ DB để đảm bảo dữ liệu đầy đủ
            var movieWithDetails = await _movieRepository.GetMovieByIdAsync(movieEntity.MovieID);

            var movieDtoResponse = new MovieDTO
            {
                MovieID = movieWithDetails.MovieID,
                Title = movieWithDetails.Title,
                Description = movieWithDetails.Description,
                ReleaseDate = movieWithDetails.ReleaseDate,
                Rating = movieWithDetails.Rating,
                TrailerUrl = movieWithDetails.TrailerUrl,
                Poster = movieWithDetails.Poster,
                Genres = movieWithDetails.MovieGenres?.Select(g => new GenreDTO
                {
                    GenreID = g.GenreID,
                    Name = g.Genre?.GenreName
                }).ToList() ?? new List<GenreDTO>(),
                Categories = movieWithDetails.MovieCategories?.Select(c => new CategoryDTO
                {
                    CategoryID = c.CategoryID,
                    CategoryName = c.Category?.CategoryName
                }).ToList() ?? new List<CategoryDTO>()
            };
            return CreatedAtAction(nameof(GetMovie), new { id = movieWithDetails.MovieID }, movieDtoResponse);
        }
        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<ActionResult<MovieDTO>> UpdateMovie(int id, [FromForm] MovieCreateUpdateDTO updateMovieDTO)
        {
            if (string.IsNullOrWhiteSpace(updateMovieDTO.Movie))
                return BadRequest("Dữ liệu không hợp lệ!");

            MovieDTO movieDto;
            try
            {
                movieDto = JsonSerializer.Deserialize<MovieDTO>(updateMovieDTO.Movie);
            }
            catch (Exception ex)
            {
                return BadRequest($"Dữ liệu phim không hợp lệ! Lỗi: {ex.Message}");
            }

            if (id != movieDto.MovieID)
                return BadRequest("ID không khớp!");

            var existingMovie = await _movieRepository.GetMovieByIdAsync(id);
            if (existingMovie == null)
                return NotFound();

            // Cập nhật thông tin cơ bản
            existingMovie.Title = movieDto.Title;
            existingMovie.Description = movieDto.Description;
            existingMovie.ReleaseDate = movieDto.ReleaseDate;
            existingMovie.Rating = movieDto.Rating;

            // Cập nhật trailer
            if (updateMovieDTO.Trailer != null)
            {
                if (!string.IsNullOrEmpty(existingMovie.TrailerUrl))
                {
                    string oldPublicId = CloudinaryService.ExtractPublicId(existingMovie.TrailerUrl);
                    await _cloudinaryService.DeleteVideoAsync(oldPublicId);
                }
                existingMovie.TrailerUrl = await _cloudinaryService.UploadVideoAsync(updateMovieDTO.Trailer, "movie_trailer");
            }

            // Cập nhật poster
            if (updateMovieDTO.Poster != null)
            {
                if (!string.IsNullOrEmpty(existingMovie.Poster))
                {
                    string oldPublicId = CloudinaryService.ExtractPublicId(existingMovie.Poster);
                    await _cloudinaryService.DeleteImageAsync(oldPublicId);
                }
                existingMovie.Poster = await _cloudinaryService.UploadImageAsync(updateMovieDTO.Poster, "movie_poster");
            }

            existingMovie.MovieGenres = movieDto.Genres?.Select(g => new Movie_Genre { GenreID = g.GenreID, MovieID = existingMovie.MovieID }).ToList() ?? new List<Movie_Genre>();
            existingMovie.MovieCategories = movieDto.Categories?.Select(c => new Movie_Category { CategoryID = c.CategoryID, MovieID = existingMovie.MovieID }).ToList() ?? new List<Movie_Category>();

            var updatedMovie = await _movieRepository.UpdateMovieAsync(existingMovie);
            return Ok(updatedMovie);
        }

        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMovie(int id)
        {
            var movie = await _movieRepository.GetMovieByIdAsync(id);
            if (movie == null) return NotFound();

            if (!string.IsNullOrEmpty(movie.TrailerUrl))
            {
                string publicId = CloudinaryService.ExtractPublicId(movie.TrailerUrl);
                await _cloudinaryService.DeleteVideoAsync(publicId);
            }

            if (!string.IsNullOrEmpty(movie.Poster))
            {
                string publicId = CloudinaryService.ExtractPublicId(movie.Poster);
                await _cloudinaryService.DeleteImageAsync(publicId);
            }

            await _movieRepository.DeleteMovieAsync(id);
            return NoContent();
        }

        [HttpGet("paged")]
        public async Task<ActionResult<object>> GetPagedMovies([FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            if (page < 1 || size < 1)
            {
                return BadRequest(new { message = "Page và Size phải lớn hơn 0" });
            }
            var movies = await _movieRepository.GetMoviesPagedAsync(page, size);
            var totalMovies = await _movieRepository.GetTotalMoviesAsync();

            int totalPages = (int)Math.Ceiling((double)totalMovies / size);
            var moviesDTO = _mapper.Map<IEnumerable<MovieDTO>>(movies);

            return Ok(new
            {
                CurrentPage = page,
                PageSize = size,
                TotalMovies = totalMovies,
                TotalPages = totalPages,
                Data = moviesDTO
            });
        }
    }
}
