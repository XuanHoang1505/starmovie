using AutoMapper;
using Microsoft.EntityFrameworkCore;
using starmovie.Data;
using starmovie.Data.Domain;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using StarMovie.Utils.Exceptions;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace starmovie.Repositories.Implementations
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly MovieContext _context;

        public CategoryRepository(MovieContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task AddCategoryAsync(Category category)
        {
            if (category == null || string.IsNullOrWhiteSpace(category.CategoryName))
            {
                throw new AppException(ErrorCode.InvalidInput, "Tên danh mục không được để trống."); // 3002 InvalidInput
            }

            if (await _context.Categories.AnyAsync(c => c.CategoryName == category.CategoryName))
            {
                throw new AppException(ErrorCode.ConflictError, "Danh mục đã tồn tại!"); // 409 ConflictError
            }

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> CategoryExistsAsync(string name)
        {
            return await _context.Categories.AnyAsync(c => c.CategoryName == name);
        }

        public async Task DeleteCategoryAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                throw new AppException(ErrorCode.ResourceNotFound, "Không tìm thấy danh mục!"); // 4001 ResourceNotFound

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Category>> GetCategoriesPagedAsync(int pageNumber, int pageSize)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;

            return await _context.Categories
                .AsNoTracking()
                .OrderBy(c => c.CategoryID)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<Category> GetCategoryByIdAsync(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
                throw new AppException(ErrorCode.ResourceNotFound, "Không tìm thấy danh mục!"); // 4001 ResourceNotFound

            return category;
        }

        public async Task<int> GetTotalCategoriesAsync()
        {
            return await _context.Categories.CountAsync();
        }

        public async Task<Category> UpdateCategoryAsync(Category category)
        {
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();

            return category;
        }
    }
}
