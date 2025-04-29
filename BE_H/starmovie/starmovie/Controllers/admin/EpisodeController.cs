using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json; // Dùng thư viện System.Text.Json
using starmovie.Data.Domain;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using starmovie.Services;
using Microsoft.AspNetCore.Authorization;

namespace starmovie.Controllers.admin
{
    [Route("api/admin/episodes")]
    [ApiController]
    public class EpisodeController : ControllerBase
    {
        private readonly IEpisodeRepository _episodeRepository;
        private readonly IMapper _mapper;
        private readonly CloudinaryService _cloudinaryService;

        public EpisodeController(IEpisodeRepository episodeRepository, IMapper mapper, CloudinaryService cloudinaryService)
        {
            _mapper = mapper;
            _episodeRepository = episodeRepository;
            _cloudinaryService = cloudinaryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EpisodeDTO>>> GetEpisodes()
        {
            var episodes = await _episodeRepository.GetAllEpisodesAsync();
            return Ok(_mapper.Map<IEnumerable<EpisodeDTO>>(episodes));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EpisodeDTO>> GetEpisode(int id)
        {
            var episode = await _episodeRepository.GetEpisodeByIdAsync(id);
            if (episode == null) return NotFound();
            return Ok(_mapper.Map<EpisodeDTO>(episode));
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<ActionResult> CreateEpisode([FromForm] EpisodeCreateUpdateDTO episodeCreateDTO)
        {
            if (string.IsNullOrWhiteSpace(episodeCreateDTO.Episode))
                return BadRequest("Dữ liệu tập phim không hợp lệ!");

            EpisodeDTO episodeDto;

            try
            {
                episodeDto = JsonSerializer.Deserialize<EpisodeDTO>(episodeCreateDTO.Episode);
            }
            catch (Exception)
            {
                return BadRequest("Dữ liệu diễn viên không hợp lệ!");
            }

            // Kiểm tra tên diễn viên có tồn tại không
            if (await _episodeRepository.EpisodeExistsAsync(episodeDto.EpisodeID))
                return BadRequest("Episode đã tồn tại!");

            // Xử lý upload ảnh nếu có
            if (episodeCreateDTO.Image != null)
            {
                episodeDto.EpisodeImage = await _cloudinaryService.UploadImageAsync(episodeCreateDTO.Image, "episode_poster");
            }

            if (episodeCreateDTO.Trailer != null)
            {
                episodeDto.TrailerUrl = await _cloudinaryService.UploadVideoAsync(episodeCreateDTO.Trailer, "episode_trailer");
            }

            if (episodeCreateDTO.EpisodeVideo != null)
            {
                episodeDto.MovieUrl = await _cloudinaryService.UploadVideoAsync(episodeCreateDTO.EpisodeVideo, "episode_video");
            }

            // Lưu vào DB
            var episodeEntity = _mapper.Map<Episode>(episodeDto);
            await _episodeRepository.AddEpisodeAsync(episodeEntity);

            return CreatedAtAction(nameof(GetEpisode), new { id = episodeEntity.EpisodeID }, _mapper.Map<EpisodeDTO>(episodeEntity));
        }



        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id}")]
        public async Task<ActionResult<EpisodeDTO>> UpdateEpisode(int id, [FromForm] EpisodeCreateUpdateDTO episodeUpdateDTO)
        {
            if (string.IsNullOrWhiteSpace(episodeUpdateDTO.Episode))
                return BadRequest("Dữ liệu không hợp lệ!");

            EpisodeDTO episodeDto;
            try
            {
                episodeDto = JsonSerializer.Deserialize<EpisodeDTO>(episodeUpdateDTO.Episode);

            }
            catch (Exception)
            {
                return BadRequest("Dữ liệu không hợp lệ!");
            }

            if (id != episodeDto.EpisodeID)
                return BadRequest("ID không khớp!");

            var existingEpisode = await _episodeRepository.GetEpisodeByIdAsync(id);
            if (existingEpisode == null) return NotFound();

            // Xử lý ảnh nếu có
            if (episodeUpdateDTO.Image != null)
            {
                if (!string.IsNullOrEmpty(existingEpisode.EpisodeImage))
                {
                    string oldPublicId = CloudinaryService.ExtractPublicId(existingEpisode.EpisodeImage);
                    await _cloudinaryService.DeleteImageAsync(oldPublicId);
                }
                existingEpisode.EpisodeImage = await _cloudinaryService.UploadImageAsync(episodeUpdateDTO.Image, "episode_poster");
            }

            if (episodeUpdateDTO.Trailer != null)
            {
                if (!string.IsNullOrEmpty(existingEpisode.TrailerUrl))
                {
                    string oldPublicId = CloudinaryService.ExtractPublicId(existingEpisode.TrailerUrl);
                    await _cloudinaryService.DeleteVideoAsync(oldPublicId);
                }
                existingEpisode.TrailerUrl = await _cloudinaryService.UploadVideoAsync(episodeUpdateDTO.Trailer, "episode_trailer");
            }

            if (episodeUpdateDTO.EpisodeVideo != null)
            {
                if (!string.IsNullOrEmpty(existingEpisode.MovieUrl))
                {
                    string oldPublicId = CloudinaryService.ExtractPublicId(existingEpisode.MovieUrl);
                    await _cloudinaryService.DeleteVideoAsync(oldPublicId);
                }
                existingEpisode.MovieUrl = await _cloudinaryService.UploadVideoAsync(episodeUpdateDTO.EpisodeVideo, "episode_video");
            }

            // Cập nhật thông tin
            _mapper.Map(episodeDto, existingEpisode);
            var updatedEpisode = await _episodeRepository.UpdateEpisodeAsync(existingEpisode);

            return Ok(_mapper.Map<EpisodeDTO>(updatedEpisode));
        }


        [Authorize(Roles = "ADMIN")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteEpisode(int id)
        {
            var episode = await _episodeRepository.GetEpisodeByIdAsync(id);
            if (episode == null) return NotFound();

            // Xóa ảnh trên Cloudinary nếu có
            if (!string.IsNullOrEmpty(episode.EpisodeImage))
            {
                string publicId = CloudinaryService.ExtractPublicId(episode.EpisodeImage);
                await _cloudinaryService.DeleteImageAsync(publicId);
            }

            if (!string.IsNullOrEmpty(episode.TrailerUrl))
            {
                string publicId = CloudinaryService.ExtractPublicId(episode.TrailerUrl);
                await _cloudinaryService.DeleteVideoAsync(publicId);
            }

            if (!string.IsNullOrEmpty(episode.MovieUrl))
            {
                string publicId = CloudinaryService.ExtractPublicId(episode.MovieUrl);
                await _cloudinaryService.DeleteVideoAsync(publicId);
            }

            await _episodeRepository.DeleteEpisodeAsync(id);
            return NoContent();
        }

        [HttpGet("paged")]
        public async Task<ActionResult<object>> GetPagedEpisodes([FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            if (page < 1 || size < 1)
            {
                return BadRequest(new { message = "Page và Size phải lớn hơn 0" });
            }
            var episodes = await _episodeRepository.GetEpisodesPagedAsync(page, size);
            var totalEpisodes = await _episodeRepository.GetTotalEpisodesAsync();

            int totalPages = (int)Math.Ceiling((double)totalEpisodes / size);

            var episodesDTO = _mapper.Map<IEnumerable<EpisodeDTO>>(episodes);

            return Ok(new
            {
                CurrentPage = page,
                PageSize = size,
                TotalEpisodes = totalEpisodes,
                TotalPages = totalPages,
                Data = episodesDTO
            });
        }
        [HttpGet("movie/{movieId}")]
        public async Task<ActionResult<IEnumerable<EpisodeDTO>>> GetEpisodesByMovieId(int movieId)
        {
            var episodes = await _episodeRepository.GetEpisodesByMovieIdAsync(movieId);
            if (episodes == null || !episodes.Any())
            {
                return NotFound(new { message = "Không tìm thấy tập phim cho bộ phim với ID này." });
            }

            var episodesDTO = _mapper.Map<IEnumerable<EpisodeDTO>>(episodes);
            return Ok(episodesDTO);
        }
    }
}
