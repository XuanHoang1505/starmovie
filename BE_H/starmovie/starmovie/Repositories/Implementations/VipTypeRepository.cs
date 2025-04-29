using AutoMapper;
using Microsoft.EntityFrameworkCore;
using starmovie.Data;
using starmovie.Data.Domain;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using StarMovie.Utils.Exceptions;


namespace starmovie.Repositories.Implementations
{
    public class VipTypeRepository : IVipTypeRepository
    {
        private readonly MovieContext _context;
        private readonly IMapper _mapper;

        public VipTypeRepository(MovieContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<VipTypeDTO>> GetAllVipTypesAsync()
        {
            var vipTypes = await _context.VipTypes.ToListAsync();

            return _mapper.Map<IEnumerable<VipTypeDTO>>(vipTypes);
        }

        public async Task<VipTypeDTO> GetVipTypeByIdAsync(int id)
        {
            var vipType = await _context.VipTypes.FindAsync(id);
            return _mapper.Map<VipTypeDTO>(vipType);
        }

        public async Task AddVipTypeAsync(VipType vipType)
        {
            if (vipType == null || string.IsNullOrWhiteSpace(vipType.TypeName))
            {
                throw new ArgumentException("Tiêu đề phim không được để trống.");
            }

            _context.VipTypes.Add(vipType);
            await _context.SaveChangesAsync();
        }

        public async Task<VipTypeDTO> UpdateVipTypeAsync(VipType vipType)
        {
            if (vipType == null)
                throw new ArgumentException("Dữ liệu phim không hợp lệ.");
            var existingVipType = await _context.VipTypes.FindAsync(vipType.VipTypeID);
            if (existingVipType == null)
                throw new AppException(ErrorCode.VipTypeNotFound, "Không tìm thấy loại VIP với ID: " + vipType.VipTypeID);

            _context.VipTypes.Update(existingVipType);
            await _context.SaveChangesAsync();
            return _mapper.Map<VipTypeDTO>(existingVipType);
        }



        public async Task DeleteVipTypeAsync(int id)
        {
            var vipType = await _context.VipTypes.FindAsync(id);
            if (vipType != null)
            {
                _context.VipTypes.Remove(vipType);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> VipTypeExistsAsync(int id)
        {
            return await _context.VipTypes.AnyAsync(m => m.VipTypeID == id);
        }

    }
}
