using starmovie.Data.Domain;
using starmovie.Models;

namespace starmovie.Repositories.Interfaces
{
    public interface IActorRepository
    {
        Task<IEnumerable<Actor>> GetAllActorsAsync();
        Task<Actor> GetActorByIdAsync(int id);
        Task AddActorAsync(Actor actor);
        Task<Actor> UpdateActorAsync(Actor actor);
        Task DeleteActorAsync(int id);

        Task<bool> ActorExistsAsync(string name);
        Task<List<Actor>> GetActorsPagedAsync(int pageNumber, int pageSize);

        Task<int> GetTotalActorsAsync();
    }
}
