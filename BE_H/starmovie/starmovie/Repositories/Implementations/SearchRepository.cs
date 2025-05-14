using AutoMapper;
using Microsoft.EntityFrameworkCore;
using starmovie.Data;
using starmovie.Data.Domain;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
namespace starmovie.Repositories.Implementations
{
    public class SearchRepository : ISearchRepository
    {
        private readonly MovieContext _context;
        private readonly IMapper _mapper;
        public SearchRepository(MovieContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<SearchDTO> SearchAll(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return new SearchDTO
                {
                    Movies = Enumerable.Empty<MovieDTO>(),
                    Actors = Enumerable.Empty<ActorDTO>()
                };
            }

            searchTerm = searchTerm.Trim();

            // Tạo truy vấn song song
            var movieQuery = _context.Movies
                .Where(m => EF.Functions.Like(
                    EF.Functions.Collate(m.Title, "SQL_Latin1_General_CP1_CI_AI"),
                    $"%{searchTerm}%"))
                .Take(10)
                .ToListAsync();

            var actorQuery = _context.Actors
                .Where(a => EF.Functions.Like(
                    EF.Functions.Collate(a.ActorName, "SQL_Latin1_General_CP1_CI_AI"),
                    $"%{searchTerm}%"))
                .Take(10)
                .ToListAsync();

            // Đợi cả hai truy vấn hoàn tất
            await Task.WhenAll(movieQuery, actorQuery);

            // Map kết quả sang DTO
            var moviesDTO = _mapper.Map<IEnumerable<MovieDTO>>(movieQuery.Result);
            var actorsDTO = _mapper.Map<IEnumerable<ActorDTO>>(actorQuery.Result);

            return new SearchDTO
            {
                Movies = moviesDTO,
                Actors = actorsDTO
            };
        }

    }
}