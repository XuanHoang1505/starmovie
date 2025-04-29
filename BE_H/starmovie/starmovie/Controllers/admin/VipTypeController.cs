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
    [Route("api/admin/vipTypes")]
    [ApiController]
    public class VipTypeController : ControllerBase
    {
        private readonly IVipTypeRepository _vipTypeRepository;
        private readonly IMapper _mapper;

        public VipTypeController(IVipTypeRepository vipTypeRepository, IMapper mapper)
        {
            _vipTypeRepository = vipTypeRepository;
            _mapper = mapper;
        }

        // Lấy tất cả loại VIP
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VipTypeDTO>>> GetVipTypes()
        {
            var vipTypes = await _vipTypeRepository.GetAllVipTypesAsync();
            return Ok(vipTypes);
        }

        // Lấy loại VIP theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<VipTypeDTO>> GetVipType(int id)
        {
            var vipType = await _vipTypeRepository.GetVipTypeByIdAsync(id);
            if (vipType == null)
                return NotFound(new { message = "Không tìm thấy loại VIP." });

            return Ok(vipType);
        }

        // Thêm mới loại VIP
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<VipTypeDTO>> CreateVipType([FromBody] VipType vipType)
        {
            try
            {
                await _vipTypeRepository.AddVipTypeAsync(vipType);
                return CreatedAtAction(nameof(GetVipType), new { id = vipType.VipTypeID }, _mapper.Map<VipTypeDTO>(vipType));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<VipTypeDTO>> UpdateVipType(int id, [FromBody] VipType vipType)
        {
            if (id != vipType.VipTypeID)
                return BadRequest(new { message = "ID không trùng khớp." });

            try
            {
                var updated = await _vipTypeRepository.UpdateVipTypeAsync(vipType);
                return Ok(updated);
            }
            catch (AppException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteVipType(int id)
        {
            var exists = await _vipTypeRepository.VipTypeExistsAsync(id);
            if (!exists)
                return NotFound(new { message = "Không tìm thấy loại VIP để xoá." });

            await _vipTypeRepository.DeleteVipTypeAsync(id);
            return NoContent();
        }
    }
}
