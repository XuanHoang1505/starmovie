using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using starmovie.Data.Domain;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using StarMovie.Utils.Exceptions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace starmovie.Controllers.admin
{
    [Route("api/admin/categories")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryController(ICategoryRepository categoryRepository, IMapper mapper)
        {
            _mapper = mapper;
            _categoryRepository = categoryRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDTO>>> GetCategories()
        {
            try
            {
                var categories = await _categoryRepository.GetAllCategoriesAsync();
                return Ok(_mapper.Map<IEnumerable<CategoryDTO>>(categories).ToList());
            }
            catch (AppException ex)
            {
                return StatusCode((int)ex.ErrorCode, new { error = ex.ErrorCode.ToString(), message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDTO>> GetCategory(int id)
        {
            try
            {
                var category = await _categoryRepository.GetCategoryByIdAsync(id);
                return Ok(_mapper.Map<CategoryDTO>(category));
            }
            catch (AppException ex)
            {
                return StatusCode((int)ex.ErrorCode, new { error = ex.ErrorCode.ToString(), message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult> CreateCategory([FromBody] CategoryDTO categoryDto)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(categoryDto.CategoryName) && await _categoryRepository.CategoryExistsAsync(categoryDto.CategoryName))
                    throw new AppException(ErrorCode.ConflictError, "Danh mục đã tồn tại!"); // 409 ConflictError

                var category = _mapper.Map<Category>(categoryDto);
                await _categoryRepository.AddCategoryAsync(category);
                return CreatedAtAction(nameof(GetCategory), new { id = category.CategoryID }, _mapper.Map<CategoryDTO>(category));
            }
            catch (AppException ex)
            {
                return StatusCode((int)ex.ErrorCode, new { error = ex.ErrorCode.ToString(), message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<CategoryDTO>> UpdateCategory(int id, [FromBody] CategoryDTO categoryDto)
        {
            try
            {
                if (categoryDto == null || id != categoryDto.CategoryID)
                    throw new AppException(ErrorCode.InvalidInput, "Dữ liệu không hợp lệ!"); // 3002 InvalidInput

                var existingCategory = await _categoryRepository.GetCategoryByIdAsync(id);
                if (existingCategory == null)
                    throw new AppException(ErrorCode.ResourceNotFound, "Không tìm thấy danh mục!"); // 4001 ResourceNotFound

                _mapper.Map(categoryDto, existingCategory);
                var updatedCategory = await _categoryRepository.UpdateCategoryAsync(existingCategory);

                var updatedCategoryDto = _mapper.Map<CategoryDTO>(updatedCategory);
                return Ok(updatedCategoryDto);
            }
            catch (AppException ex)
            {
                return StatusCode((int)ex.ErrorCode, new { error = ex.ErrorCode.ToString(), message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            try
            {
                var category = await _categoryRepository.GetCategoryByIdAsync(id);
                if (category == null)
                    throw new AppException(ErrorCode.ResourceNotFound, "Không tìm thấy danh mục!"); // 4001 ResourceNotFound

                await _categoryRepository.DeleteCategoryAsync(id);
                return NoContent();
            }
            catch (AppException ex)
            {
                return StatusCode((int)ex.ErrorCode, new { error = ex.ErrorCode.ToString(), message = ex.Message });
            }
        }

        [HttpGet("paged")]
        public async Task<ActionResult<object>> GetPagedCategories([FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            try
            {
                if (page < 1 || size < 1)
                {
                    throw new AppException(ErrorCode.InvalidInput, "Page và Size phải lớn hơn 0"); // 3002 InvalidInput
                }

                var categories = await _categoryRepository.GetCategoriesPagedAsync(page, size);
                var totalCategories = await _categoryRepository.GetTotalCategoriesAsync();

                int totalPages = (int)Math.Ceiling((double)totalCategories / size);
                var categoriesDTO = _mapper.Map<IEnumerable<CategoryDTO>>(categories);

                return Ok(new
                {
                    CurrentPage = page,
                    PageSize = size,
                    TotalCategories = totalCategories,
                    TotalPages = totalPages,
                    Data = categoriesDTO
                });
            }
            catch (AppException ex)
            {
                return StatusCode((int)ex.ErrorCode, new { error = ex.ErrorCode.ToString(), message = ex.Message });
            }
        }
    }
}
