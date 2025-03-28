using starmovie.Data.Domain;
using starmovie.Models;

namespace starmovie.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task<Category> GetCategoryByIdAsync(int id);
        Task AddCategoryAsync(Category category);
        Task<Category> UpdateCategoryAsync(Category category);
        Task DeleteCategoryAsync(int id);

        Task<bool> CategoryExistsAsync(string name);
        Task<List<Category>> GetCategoriesPagedAsync(int pageNumber, int pageSize);

        Task<int> GetTotalCategoriesAsync();
    }
}
