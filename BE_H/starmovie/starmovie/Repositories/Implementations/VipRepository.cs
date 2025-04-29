using AutoMapper;
using Microsoft.EntityFrameworkCore;
using starmovie.Data;
using starmovie.Data.Domain;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using StarMovie.Utils.Exceptions;


namespace starmovie.Repositories.Implementations
{
    public class VipRepository : IVipRepository
    {
        private readonly MovieContext _context;
        private readonly IMapper _mapper;

        public VipRepository(MovieContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<VipDTO>> GetAllVipsAsync()
        {
            var vips = await _context.Vips
            .Include(v => v.User)
            .Include(v => v.VipType)
            .ToListAsync();

            return _mapper.Map<IEnumerable<VipDTO>>(vips);
        }

        public async Task<VipDTO> GetVipByIdAsync(int id)
        {
            var vip = await _context.Vips
                .Include(v => v.User)
                .Include(v => v.VipType)
                .FirstOrDefaultAsync(v => v.VipID == id);
            return _mapper.Map<VipDTO>(vip);
        }

        public async Task<VipDTO> AddVipAsync(Vip vip)
        {
            if (vip == null)
                throw new ArgumentNullException(nameof(vip));

            var vipType = await _context.VipTypes.FindAsync(vip.VipTypeID);
            if (vipType == null)
                throw new ArgumentException("Loại VIP không tồn tại.");

            vip.RegisteredDate = DateTime.Now;
            vip.ExpirationDate = DateTime.Now.AddDays(vipType.Duration);

            bool isOverlap = await UserHasVipInDateRangeAsync(vip.UserID, vip.RegisteredDate, vip.ExpirationDate);

            if (isOverlap)
            {
                throw new AppException(ErrorCode.VipAlreadyExists, "Người dùng đã có VIP trong khoảng thời gian này.");
            }
            _context.Vips.Add(vip);
            await _context.SaveChangesAsync();

            var vipFull = await _context.Vips
                .Include(v => v.User)
                .Include(v => v.VipType)
                .FirstOrDefaultAsync(v => v.VipID == vip.VipID);

            return _mapper.Map<VipDTO>(vipFull);
        }


        public async Task<VipDTO> UpdateVipAsync(Vip vip)
        {
            if (vip == null)
                throw new ArgumentException("Dữ liệu VIP không hợp lệ.");

            var existingVip = await _context.Vips.FindAsync(vip.VipID);
            if (existingVip == null)
                throw new AppException(ErrorCode.VipNotFound, $"Không tìm thấy VIP với ID: {vip.VipID}");

            // Kiểm tra xem loại VIP có thay đổi không
            if (existingVip.VipTypeID != vip.VipTypeID)
            {
                var vipType = await _context.VipTypes.FindAsync(vip.VipTypeID);
                if (vipType == null)
                    throw new AppException(ErrorCode.VipTypeNotFound, "Loại VIP không hợp lệ.");

                existingVip.VipTypeID = vip.VipTypeID;
                // Nếu loại VIP thay đổi, cập nhật lại ngày đăng ký và ngày hết hạn
                existingVip.RegisteredDate = DateTime.Now;
                existingVip.ExpirationDate = DateTime.Now.AddDays(vipType.Duration);

            }

            // Map các trường còn lại từ vip vào existingVip
            _mapper.Map(vip, existingVip);
            await _context.SaveChangesAsync();

            var vipFull = await _context.Vips
                .Include(v => v.User)
                .Include(v => v.VipType)
                .FirstOrDefaultAsync(v => v.VipID == existingVip.VipID);

            return _mapper.Map<VipDTO>(vipFull);
        }

        public async Task DeleteVipAsync(int id)
        {
            var vip = await _context.Vips.FindAsync(id);
            if (vip != null)
            {
                _context.Vips.Remove(vip);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> VipExistsAsync(int id)
        {
            return await _context.Vips.AnyAsync(m => m.VipID == id);
        }

        public async Task<bool> UserHasVipInDateRangeAsync(string userId, DateTime startDate, DateTime endDate)
        {
            return await _context.Vips.AnyAsync(v =>
                v.UserID == userId &&
                v.ExpirationDate > startDate &&
                v.RegisteredDate < endDate
            );
        }
    }
}
