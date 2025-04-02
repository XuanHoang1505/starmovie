namespace starmovie.Repositories.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using starmovie.Data;
    using starmovie.Data.Domain;
    using starmovie.Repositories.Interfaces;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class ActorRepository : IActorRepository
    {
        private readonly MovieContext _context;

        public ActorRepository(MovieContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Actor>> GetAllActorsAsync()
        {
            return await _context.Actors.ToListAsync();
        }

        public async Task AddActorAsync(Actor actor)
        {
            if (actor == null || string.IsNullOrWhiteSpace(actor.ActorName))
            {
                throw new ArgumentException("Tên diễn viên không được để trống.");
            }

            _context.Actors.Add(actor);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ActorExistsAsync(string name)
        {
            return await _context.Actors.AnyAsync(a => a.ActorName == name);
        }

        public async Task DeleteActorAsync(int id)
        {
            var actor = await _context.Actors.FindAsync(id);
            if (actor != null)
            {
                _context.Actors.Remove(actor);
                await _context.SaveChangesAsync();
            }
        }


        public async Task<List<Actor>> GetActorsPagedAsync(int pageNumber, int pageSize)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 10;

            return await _context.Actors
                .AsNoTracking()
                .OrderBy(a => a.ActorID)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<Actor> GetActorByIdAsync(int id)
        {
            return await _context.Actors.FindAsync(id);
        }

        public async Task<int> GetTotalActorsAsync()
        {
            return await _context.Actors.CountAsync();
        }

        public async Task<Actor> UpdateActorAsync(Actor actor)
        {
            _context.Actors.Update(actor);
            await _context.SaveChangesAsync();

            return actor;
        }
    }
}