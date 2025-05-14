namespace starmovie.Controllers.admin
{
    using Microsoft.AspNetCore.Mvc;
    using starmovie.Repositories.Interfaces;
    using System.Threading.Tasks;

    [Route("api/site/search")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ISearchRepository _searchRepository;

        public SearchController(ISearchRepository searchRepository)
        {
            _searchRepository = searchRepository;
        }

        [HttpGet]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Search term is required");

            var result = await _searchRepository.SearchAll(query);
            return Ok(result);
        }
    }
}
