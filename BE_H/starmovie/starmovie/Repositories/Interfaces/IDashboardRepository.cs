using starmovie.Models;

namespace starmovie.Repositories.Interfaces
{
    public interface IDashboardRepository
    {
        Task<DashboardStatisticsDTO> GetDashboardStatisticsAsync();
        Task<IEnumerable<UserRegistrationChartDTO>> GetUserRegistrationStatisticsAsync(int year);
        Task<IEnumerable<MovieGenreStatisticDTO>> GetMovieCountByGenreAsync();
        Task<IEnumerable<TopMovieRatingDTO>> GetTopMovieRatingAsync(int limit);
        Task<IEnumerable<TopMovieViewDTO>> GetTopMovieViewAsync(int limit);
        Task<IEnumerable<RecentActivityDTO>> GetRecentActivitiesAsync(int limit);

    }
}