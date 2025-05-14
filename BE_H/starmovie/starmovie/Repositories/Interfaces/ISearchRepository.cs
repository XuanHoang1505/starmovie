using starmovie.Models;
namespace starmovie.Repositories.Interfaces
{
    public interface ISearchRepository
    {
        Task<SearchDTO> SearchAll(string searchTerm);
    }
}