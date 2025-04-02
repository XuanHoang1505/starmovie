using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using starmovie.Data.Domain;
using starmovie.Models;
using starmovie.Repositories.Interfaces;

namespace starmovie.Controllers.admin
{
    [Route("api/admin/movieSlides")]
    [ApiController]
    public class MovieSlideController : ControllerBase
    {
        private readonly IMovieSlideRepository _movieSlideRepository;
        private readonly IMapper _mapper;

        public MovieSlideController(IMovieSlideRepository movieSlideRepository, IMapper mapper)
        {
            _mapper = mapper;
            _movieSlideRepository = movieSlideRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MovieSlideDTO>>> GetMovieSlides()
        {
            var movieSlides = await _movieSlideRepository.GetAllMovieSlidesAsync();

            // Lấy poster của phim từ Movie
            var movieSlideDTOs = movieSlides.Select(slide => new MovieSlideDTO
            {
                SlideID = slide.SlideID,
                Position = slide.Position,
                MovieID = slide.MovieID,
            });

            return Ok(movieSlideDTOs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MovieSlideDTO>> GetMovieSlide(int id)
        {
            var movieSlide = await _movieSlideRepository.GetMovieSlideByIdAsync(id);
            if (movieSlide == null) return NotFound();

            var movieSlideDTO = new MovieSlideDTO
            {
                SlideID = movieSlide.SlideID,
                Position = movieSlide.Position,
                MovieID = movieSlide.MovieID,
            };

            return Ok(movieSlideDTO);
        }

        [HttpPost]
        public async Task<ActionResult> CreateMovieSlide([FromBody] MovieSlideDTO movieSlideDto)
        {
            if (movieSlideDto == null)
                return BadRequest("Dữ liệu không hợp lệ!");

            if (await _movieSlideRepository.MovieSlideExistsAsync(movieSlideDto.SlideID))
                return BadRequest("MovieSlide đã tồn tại!");

            var movieSlideEntity = _mapper.Map<MovieSlide>(movieSlideDto);
            await _movieSlideRepository.AddMovieSlideAsync(movieSlideEntity);

            return CreatedAtAction(nameof(GetMovieSlide), new { id = movieSlideEntity.SlideID }, movieSlideDto);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<MovieSlideDTO>> UpdateMovieSlide(int id, [FromBody] MovieSlideDTO movieSlideDto)
        {
            if (id != movieSlideDto.SlideID)
                return BadRequest("ID không khớp!");

            var existingMovieSlide = await _movieSlideRepository.GetMovieSlideByIdAsync(id);
            if (existingMovieSlide == null) return NotFound();

            _mapper.Map(movieSlideDto, existingMovieSlide);
            var updatedMovieSlide = await _movieSlideRepository.UpdateMovieSlideAsync(existingMovieSlide);

            return Ok(_mapper.Map<MovieSlideDTO>(updatedMovieSlide));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMovieSlide(int id)
        {
            var movieSlide = await _movieSlideRepository.GetMovieSlideByIdAsync(id);
            if (movieSlide == null) return NotFound();

            await _movieSlideRepository.DeleteMovieSlideAsync(id);
            return NoContent();
        }
    }
}
