using AutoMapper;
using Microsoft.EntityFrameworkCore;
using starmovie.Data;
using starmovie.Models;
using starmovie.Repositories.Interfaces;

namespace starmovie.Repositories.Implementations
{
    public class BookRepository : IBookRepository
    {
        private readonly MovieContext _movieContext;
        private readonly IMapper _mapper;

        public BookRepository(MovieContext movieContext, IMapper mapper)
        {
            _movieContext = movieContext;
            _mapper = mapper;
        }

        public async Task<int> AddBookAsync(BookModel book)
        {
            var newBook = _mapper.Map<Book>(book);
            _movieContext.Books.Add(newBook);
            await _movieContext.SaveChangesAsync();

            return newBook.Id;
        }

        public async Task DeleteBookAsync(int id)
        {
            var deleteBook = await _movieContext.Books.FirstOrDefaultAsync(b => b.Id == id);
            if (deleteBook != null)
            {
                _movieContext.Books.Remove(deleteBook);
                await _movieContext.SaveChangesAsync();
            }
        }

        public async Task<List<BookModel>> GetAllBookAsync()
        {
            var books = await _movieContext.Books.ToArrayAsync();
            return _mapper.Map<List<BookModel>>(books);
        }

        public async Task<BookModel> GetBookAsync(int id)
        {
            var book = await _movieContext.Books.FindAsync(id);
            return _mapper.Map<BookModel>(book);
        }

        public async Task UpdateBookAsync(int id, BookModel model)
        {
            if (id == model.Id)
            {
                var bookUpdate = _mapper.Map<Book>(model);
                _movieContext.Books.Update(bookUpdate);
                await _movieContext.SaveChangesAsync();
            }
        }
    }
}
