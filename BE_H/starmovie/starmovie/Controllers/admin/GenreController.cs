using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using starmovie.Data.Domain;
using starmovie.Models;
using starmovie.Repositories.Interfaces;

namespace starmovie.Controllers.admin
{
    [Route("api/admin/genres")]
    [ApiController]
    public class GenreController : ControllerBase
    {
        private readonly IGenreRepository _genreRepository;
        private readonly IMapper _mapper;

        public GenreController(IGenreRepository genreRepository, IMapper mapper)
        {
            _genreRepository = genreRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GenreDTO>>> GetGenres()
        {
            var genres = await _genreRepository.GetAllGenresAsync();
            return Ok(_mapper.Map<IEnumerable<GenreDTO>>(genres).ToList());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GenreDTO>> GetGenre(int id)
        {
            var genre = await _genreRepository.GetGenreByIdAsync(id);
            if (genre == null) return NotFound();
            return Ok(_mapper.Map<GenreDTO>(genre));
        }

        [HttpPost]
        public async Task<ActionResult> CreateGenre([FromBody] GenreDTO genreDto)
        {
            if (!string.IsNullOrWhiteSpace(genreDto.Name) && await _genreRepository.GenreExistsAsync(genreDto.Name))
                return BadRequest("Genre đã tồn tại!");

            var genre = _mapper.Map<Genre>(genreDto);
            await _genreRepository.AddGenreAsync(genre);
            return CreatedAtAction(nameof(GetGenre), new { id = genre.GenreID }, _mapper.Map<GenreDTO>(genre));
        }


        [HttpPut("{id}")]
        public async Task<ActionResult<GenreDTO>> UpdateGenre(int id, [FromBody] GenreDTO genreDto)
        {
            if (genreDto == null || id != genreDto.GenreID) return BadRequest();

            var existingGenre = await _genreRepository.GetGenreByIdAsync(id);
            if (existingGenre == null) return NotFound();

            _mapper.Map(genreDto, existingGenre);

            var updatedGenre = await _genreRepository.UpdateGenreAsync(existingGenre);
            if (updatedGenre == null) return NotFound();

            var updatedGenreDto = _mapper.Map<GenreDTO>(updatedGenre);
            return Ok(updatedGenreDto);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteGenre(int id)
        {
            var genre = await _genreRepository.GetGenreByIdAsync(id);
            if (genre == null) return NotFound();

            await _genreRepository.DeleteGenreAsync(id);
            return NoContent();
        }
        [HttpGet("paged")]
        public async Task<ActionResult<object>> GetGenresPaged([FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            // Đảm bảo giá trị hợp lệ (tránh lỗi DB)
            if (page < 1 || size < 1)
            {
                return BadRequest(new { message = "Page và Size phải lớn hơn 0" });
            }

            // Lấy danh sách thể loại theo trang
            var genres = await _genreRepository.GetGenresPagedAsync(page, size);
            var totalGenres = await _genreRepository.GetTotalGenresAsync(); // Hàm đếm tổng số thể loại

            // Tính tổng số trang
            int totalPages = (int)Math.Ceiling((double)totalGenres / size);

            // Ánh xạ sang DTO
            var genreDTOs = _mapper.Map<IEnumerable<GenreDTO>>(genres);

            // Trả về dữ liệu kèm thông tin phân trang
            return Ok(new
            {
                CurrentPage = page,
                PageSize = size,
                TotalGenres = totalGenres,
                TotalPages = totalPages,
                Data = genreDTOs
            });
        }



    }
}
