using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using starmovie.Data.Domain;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using System.Text.Json.Serialization;
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
            var categories = await _categoryRepository.GetAllCategoriesAsync();
            return Ok(_mapper.Map<IEnumerable<CategoryDTO>>(categories).ToList());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDTO>> GetCategory(int id)
        {
            var category = await _categoryRepository.GetCategoryByIdAsync(id);
            if (category == null) return NotFound();
            return Ok(_mapper.Map<CategoryDTO>(category));
        }

        [HttpPost]
        public async Task<ActionResult> CreateCategory([FromBody] CategoryDTO categoryDto)
        {
            if (!string.IsNullOrWhiteSpace(categoryDto.CategoryName) && await _categoryRepository.CategoryExistsAsync(categoryDto.CategoryName))
                return BadRequest("Category đã tồn tại!");

            var category = _mapper.Map<Category>(categoryDto);
            await _categoryRepository.AddCategoryAsync(category);
            return CreatedAtAction(nameof(GetCategory), new { id = category.CategoryID }, _mapper.Map<CategoryDTO>(category));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CategoryDTO>> UpdateCategory(int id, [FromBody] CategoryDTO categoryDto)
        {
            if (categoryDto == null || id != categoryDto.CategoryID) return BadRequest();

            var existingCategory = await _categoryRepository.GetCategoryByIdAsync(id);
            if (existingCategory == null) return NotFound();

            _mapper.Map(categoryDto, existingCategory);

            var updateCategory = await _categoryRepository.UpdateCategoryAsync(existingCategory);
            if (updateCategory == null) return NotFound();

            var updatedCategoryDto = _mapper.Map<CategoryDTO>(updateCategory);
            return Ok(updatedCategoryDto);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            var category = await _categoryRepository.GetCategoryByIdAsync(id);
            if (category == null) return NotFound();

            await _categoryRepository.DeleteCategoryAsync(id);
            return NoContent();
        }
        [HttpGet("paged")]
        public async Task<ActionResult<object>> GetPagedCategories([FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            if (page < 1 || size < 1)
            {
                return BadRequest(new { message = "Page và Size phải lớn hơn 0" });
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
    }
}