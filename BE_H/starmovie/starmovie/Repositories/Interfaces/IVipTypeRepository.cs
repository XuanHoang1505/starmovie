using starmovie.Data.Domain;
using starmovie.Models; // Import DTO

namespace starmovie.Repositories.Interfaces
{
    public interface IVipTypeRepository
    {
        Task<IEnumerable<VipTypeDTO>> GetAllVipTypesAsync();
        Task<VipTypeDTO> GetVipTypeByIdAsync(int id);
        Task AddVipTypeAsync(VipType vipType);
        Task<VipTypeDTO> UpdateVipTypeAsync(VipType vipType);
        Task DeleteVipTypeAsync(int id);
        Task<bool> VipTypeExistsAsync(int id);

    }
}
