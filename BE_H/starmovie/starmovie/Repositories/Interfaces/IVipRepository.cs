using starmovie.Data.Domain;
using starmovie.Models;

namespace starmovie.Repositories.Interfaces
{
    public interface IVipRepository
    {
        Task<IEnumerable<VipDTO>> GetAllVipsAsync();
        Task<VipDTO> GetVipByIdAsync(int id);
        Task<VipDTO> AddVipAsync(Vip vip);
        Task<VipDTO> UpdateVipAsync(Vip vip);
        Task DeleteVipAsync(int id);
        Task<bool> VipExistsAsync(int id);

        Task<bool> UserHasVipInDateRangeAsync(string userId, DateTime startDate, DateTime endDate);

    }
}
