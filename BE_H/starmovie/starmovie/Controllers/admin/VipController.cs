using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using starmovie.Data.Domain;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using starmovie.Services;
using Microsoft.AspNetCore.Authorization;
using StarMovie.Utils.Exceptions;

namespace starmovie.Controllers.admin
{
    [Route("api/admin/vips")]
    [ApiController]
    public class VipController : ControllerBase
    {
        private readonly IVipRepository _vipRepository;
        private readonly IMapper _mapper;

        public VipController(IVipRepository vipRepository, IMapper mapper)
        {
            _vipRepository = vipRepository;
            _mapper = mapper;
        }

        // Lấy tất cả VIP
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VipDTO>>> GetVips()
        {
            var vips = await _vipRepository.GetAllVipsAsync();
            return Ok(vips);
        }

        // Lấy VIP theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<VipDTO>> GetVip(int id)
        {
            var vip = await _vipRepository.GetVipByIdAsync(id);
            if (vip == null)
                return NotFound(new { message = "Không tìm thấy VIP." });

            return Ok(vip);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<VipDTO>> CreateVip([FromBody] VipDTO vipDto)
        {
            if (vipDto == null)
                return BadRequest(new { message = "Dữ liệu VIP không hợp lệ." });

            try
            {
                var vip = _mapper.Map<Vip>(vipDto);
                var vipCreate = await _vipRepository.AddVipAsync(vip);
                return Ok(vipCreate);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<VipDTO>> UpdateVip(int id, [FromBody] VipDTO vipDto)
        {
            if (id != vipDto.VipID)
                return BadRequest(new { message = "ID không trùng khớp." });

            try
            {
                var vip = _mapper.Map<Vip>(vipDto);
                var updated = await _vipRepository.UpdateVipAsync(vip);
                return Ok(updated);
            }
            catch (AppException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Đã có lỗi xảy ra.", details = ex.Message });
            }
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteVip(int id)
        {
            var exists = await _vipRepository.VipExistsAsync(id);
            if (!exists)
                return NotFound(new { message = "Không tìm thấy VIP để xoá." });

            await _vipRepository.DeleteVipAsync(id);
            return NoContent();
        }
    }
}
