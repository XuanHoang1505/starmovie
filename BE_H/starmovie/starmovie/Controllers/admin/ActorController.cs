namespace starmovie.Controllers.admin
{
    using AutoMapper;
    using Microsoft.AspNetCore.Mvc;
    using starmovie.Data.Domain;
    using starmovie.Models;
    using starmovie.Repositories.Interfaces;
    using starmovie.Services;
    using StarMovie.Utils.Exceptions; // Chú ý bổ sung namespace để sử dụng AppException và ErrorCode.
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Text.Json;
    using Microsoft.AspNetCore.Authorization;

    [Route("api/admin/actors")]
    [ApiController]
    public class ActorController : ControllerBase
    {
        private readonly IActorRepository _actorRepository;
        private readonly IMapper _mapper;
        private readonly CloudinaryService _cloudinaryService;

        public ActorController(IActorRepository actorRepository, IMapper mapper, CloudinaryService cloudinaryService)
        {
            _mapper = mapper;
            _actorRepository = actorRepository;
            _cloudinaryService = cloudinaryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActorDTO>>> GetActors()
        {
            try
            {
                var actors = await _actorRepository.GetAllActorsAsync();
                return Ok(_mapper.Map<IEnumerable<ActorDTO>>(actors));
            }
            catch (AppException ex)
            {
                return StatusCode((int)ex.ErrorCode, new { error = ex.ErrorCode.ToString(), message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ActorDTO>> GetActor(int id)
        {
            try
            {
                var actor = await _actorRepository.GetActorByIdAsync(id);
                return Ok(_mapper.Map<ActorDTO>(actor));
            }
            catch (AppException ex)
            {
                return StatusCode((int)ex.ErrorCode, new { error = ex.ErrorCode.ToString(), message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult> CreateActor([FromForm] string actor, [FromForm] IFormFile file)
        {
            if (string.IsNullOrWhiteSpace(actor))
                return BadRequest("Dữ liệu diễn viên không hợp lệ!");

            ActorDTO actorDto;

            try
            {
                actorDto = JsonSerializer.Deserialize<ActorDTO>(actor);
            }
            catch (Exception)
            {
                return BadRequest("Dữ liệu diễn viên không hợp lệ!");
            }

            try
            {
                // Kiểm tra tên diễn viên có tồn tại không
                if (!string.IsNullOrWhiteSpace(actorDto.ActorName) && await _actorRepository.ActorExistsAsync(actorDto.ActorName))
                    return BadRequest("Diễn viên đã tồn tại!");

                // Xử lý upload ảnh nếu có
                if (file != null)
                {
                    string imageUrl = await _cloudinaryService.UploadImageAsync(file, "actor");
                    actorDto.Avatar = imageUrl;
                }

                // Lưu vào DB
                var actorEntity = _mapper.Map<Actor>(actorDto);
                await _actorRepository.AddActorAsync(actorEntity);

                return CreatedAtAction(nameof(GetActor), new { id = actorEntity.ActorID }, _mapper.Map<ActorDTO>(actorEntity));
            }
            catch (AppException ex)
            {
                return StatusCode((int)ex.ErrorCode, new { error = ex.ErrorCode.ToString(), message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<ActorDTO>> UpdateActor(int id, [FromForm] string actor, [FromForm] IFormFile file)
        {
            if (string.IsNullOrWhiteSpace(actor)) return BadRequest("Dữ liệu không hợp lệ!");

            ActorDTO actorDto;
            try
            {
                actorDto = JsonSerializer.Deserialize<ActorDTO>(actor);
            }
            catch (Exception)
            {
                return BadRequest("Dữ liệu không hợp lệ!");
            }

            if (id != actorDto.ActorID) return BadRequest("ID không khớp!");

            try
            {
                var existingActor = await _actorRepository.GetActorByIdAsync(id);
                if (existingActor == null) return NotFound();

                // Xử lý ảnh nếu có
                if (file != null)
                {
                    if (!string.IsNullOrEmpty(existingActor.Avatar))
                    {
                        string oldPublicId = CloudinaryService.ExtractPublicId(existingActor.Avatar);
                        await _cloudinaryService.DeleteImageAsync(oldPublicId);
                    }

                    string newImageUrl = await _cloudinaryService.UploadImageAsync(file, "actor");
                    actorDto.Avatar = newImageUrl;
                }
                else
                {
                    actorDto.Avatar = existingActor.Avatar;
                }

                // Cập nhật thông tin
                _mapper.Map(actorDto, existingActor);
                var updatedActor = await _actorRepository.UpdateActorAsync(existingActor);

                return Ok(_mapper.Map<ActorDTO>(updatedActor));
            }
            catch (AppException ex)
            {
                return StatusCode((int)ex.ErrorCode, new { error = ex.ErrorCode.ToString(), message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult> DeleteActor(int id)
        {
            try
            {
                var actor = await _actorRepository.GetActorByIdAsync(id);
                if (actor == null) return NotFound();

                // Xóa ảnh trên Cloudinary nếu có
                if (!string.IsNullOrEmpty(actor.Avatar))
                {
                    string publicId = CloudinaryService.ExtractPublicId(actor.Avatar);
                    await _cloudinaryService.DeleteImageAsync(publicId);
                }

                await _actorRepository.DeleteActorAsync(id);
                return NoContent();
            }
            catch (AppException ex)
            {
                return StatusCode((int)ex.ErrorCode, new { error = ex.ErrorCode.ToString(), message = ex.Message });
            }
        }

        [HttpGet("paged")]
        public async Task<ActionResult<object>> GetPagedActors([FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            try
            {
                if (page < 1 || size < 1)
                {
                    return BadRequest(new { message = "Page và Size phải lớn hơn 0" });
                }

                var actors = await _actorRepository.GetActorsPagedAsync(page, size);
                var totalActors = await _actorRepository.GetTotalActorsAsync();

                int totalPages = (int)Math.Ceiling((double)totalActors / size);

                var actorsDTO = _mapper.Map<IEnumerable<ActorDTO>>(actors);

                return Ok(new
                {
                    CurrentPage = page,
                    PageSize = size,
                    TotalActors = totalActors,
                    TotalPages = totalPages,
                    Data = actorsDTO
                });
            }
            catch (AppException ex)
            {
                return StatusCode((int)ex.ErrorCode, new { error = ex.ErrorCode.ToString(), message = ex.Message });
            }
        }
    }
}
