namespace starmovie.Controllers.admin
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using starmovie.Models;
    using starmovie.Repositories.Interfaces;
    using System.Threading.Tasks;

    [Route("api/admin/dashboard")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardRepository _dashboardRepository;

        public DashboardController(IDashboardRepository dashboardRepository)
        {
            _dashboardRepository = dashboardRepository;
        }

        [HttpGet("statistics")]
        public async Task<ActionResult<DashboardStatisticsDTO>> GetDashboardStatistics()
        {
            try
            {
                var statistics = await _dashboardRepository.GetDashboardStatisticsAsync();
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "InternalServerError", message = ex.Message });
            }
        }
        [HttpGet("user-registration/{year}")]
        public async Task<ActionResult<IEnumerable<UserRegistrationChartDTO>>> GetUserRegistrationStatistics(int year)
        {
            try
            {
                var statistics = await _dashboardRepository.GetUserRegistrationStatisticsAsync(year);
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "InternalServerError", message = ex.Message });
            }
        }
        [HttpGet("movie-count-by-genre")]
        public async Task<ActionResult<IEnumerable<MovieGenreStatisticDTO>>> GetMovieCountByGenre()
        {
            try
            {
                var statistics = await _dashboardRepository.GetMovieCountByGenreAsync();
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "InternalServerError", message = ex.Message });
            }
        }

        [HttpGet("top-rated-movies")]
        public async Task<ActionResult<IEnumerable<TopMovieRatingDTO>>> GetTopRatedMovies([FromQuery] int limit = 5)
        {
            try
            {
                var statistics = await _dashboardRepository.GetTopMovieRatingAsync(limit);
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "InternalServerError", message = ex.Message });
            }
        }
        [HttpGet("top-viewed-movies")]
        public async Task<ActionResult<IEnumerable<TopMovieViewDTO>>> GetTopViewedMovies([FromQuery] int limit = 10)
        {
            try
            {
                var statistics = await _dashboardRepository.GetTopMovieViewAsync(limit);
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "InternalServerError", message = ex.Message });
            }
        }
        [HttpGet("recent-activities")]
        public async Task<ActionResult<IEnumerable<RecentActivityDTO>>> GetRecentActivities([FromQuery] int limit = 2)
        {
            try
            {
                var activities = await _dashboardRepository.GetRecentActivitiesAsync(limit);
                return Ok(activities);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "InternalServerError", message = ex.Message });
            }
        }
    }
}


