using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using starmovie.Models;
using starmovie.Repositories;

namespace starmovie.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IBookRepository _bookRepo;

        public ProductsController(IBookRepository bookRepository) {
            _bookRepo = bookRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBook() {
            try
            {
                return Ok(await _bookRepo.GetAllBookAsync());
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }

        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookById(int id)
        {
            var book = await _bookRepo.GetBookAsync(id);
            return book == null ? NotFound() : Ok(book);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddNewBook(BookModel model)
        {
            try
            {
                var newBookId = await _bookRepo.AddBookAsync(model);
                var book = await _bookRepo.GetBookAsync(newBookId);
                return book == null ? NotFound() : Ok(book);
            }
            catch (Exception ex) {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpadteBook(int id, BookModel bookModel)
        {
            if(id != bookModel.Id)
            {
                return NotFound();
            }
            await _bookRepo.UpdateBookAsync(id, bookModel);
            return Ok();
        }

        [HttpDelete]
        [Authorize]
        public async Task<IActionResult> DeleteBook(int id)
        {
            try
            {
                var bookDelete = await _bookRepo.GetBookAsync(id);
                if (bookDelete == null)
                {
                    return NotFound($"Không tìm thấy sách có id = {id}" );
                }
                await _bookRepo.DeleteBookAsync(id);
                return Ok($"Sách có id = {id} đã được xóa");
            }
            catch (Exception ex) {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
