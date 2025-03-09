using starmovie.Models;

namespace starmovie.Repositories
{
    public interface IBookRepository
    {
        public Task<List<BookModel>> GetAllBookAsync();
        public Task<BookModel> GetBookAsync(int id);
        public Task<int> AddBookAsync(BookModel book); 
        public Task UpdateBookAsync(int id, BookModel model);
        public Task DeleteBookAsync(int id);
    }
}
