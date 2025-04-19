namespace starmovie.Repositories.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using starmovie.Data;
    using starmovie.Models;
    using starmovie.Repositories.Interfaces;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class DashboardRepository : IDashboardRepository
    {
        private readonly MovieContext _context;

        public DashboardRepository(MovieContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatisticsDTO> GetDashboardStatisticsAsync()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalMovies = await _context.Movies.CountAsync();
            var totalVipUsers = await _context.Vips.CountAsync(v => v.ExpirationDate > DateTime.Now);
            var totalGenres = await _context.Genres.CountAsync();
            var totalRevenue = await _context.Vips
                .SumAsync(v => (double?)v.VipType.Price) ?? 0;
            return new DashboardStatisticsDTO
            {
                TotalUsers = totalUsers,
                TotalMovies = totalMovies,
                TotalVipUsers = totalVipUsers,
                TotalGenres = totalGenres,
                TotalRevenue = totalRevenue
            };
        }

        public async Task<IEnumerable<MovieGenreStatisticDTO>> GetMovieCountByGenreAsync()
        {
            var stats = await _context.MovieGenres
                .Include(mg => mg.Genre)
                .GroupBy(mg => mg.Genre.GenreName)
                .Select(g => new MovieGenreStatisticDTO
                {
                    Genre = g.Key,
                    MovieCount = g.Count()
                })
                .ToListAsync();
            return stats;
        }


        public async Task<IEnumerable<UserRegistrationChartDTO>> GetUserRegistrationStatisticsAsync(int year)
        {
            var months = Enumerable.Range(1, 12)
                .Select(month => new
                {
                    Month = month,
                    Start = new DateTime(year, month, 1),
                    End = new DateTime(year, month, DateTime.DaysInMonth(year, month), 23, 59, 59)
                });

            var result = new List<UserRegistrationChartDTO>();

            foreach (var m in months)
            {
                int totalUsers = await _context.Users
                    .CountAsync(u => u.RegisterDate >= m.Start && u.RegisterDate <= m.End);

                int vipUsers = await _context.Vips
                    .CountAsync(v => v.RegisteredDate >= m.Start && v.RegisteredDate <= m.End);

                result.Add(new UserRegistrationChartDTO($"T{m.Month}", totalUsers, vipUsers));
            }

            return result;
        }
        public async Task<IEnumerable<TopMovieRatingDTO>> GetTopMovieRatingAsync(int limit)
        {
            var topMovies = await _context.Reviews
                .Include(r => r.Movie)
                .Where(r => r.Movie != null)
                .GroupBy(r => new { r.Movie.MovieID, r.Movie.Title, r.Movie.Poster })
                .Select(g => new TopMovieRatingDTO
                {
                    MovieName = g.Key.Title,
                    AverageRating = Math.Round(g.Average(r => r.Rating), 2),
                    TotalRatings = g.Count(),
                    PosterUrl = g.Key.Poster
                })
                .OrderByDescending(m => m.AverageRating)
                .ThenByDescending(m => m.TotalRatings)
                .Take(limit)
                .ToListAsync();

            return topMovies;
        }

        public async Task<IEnumerable<TopMovieViewDTO>> GetTopMovieViewAsync(int limit)
        {
            var topMovies = await _context.Episodes
                .Include(e => e.Movie)
                .GroupBy(e => new { e.Movie.MovieID, e.Movie.Title })
                .Select(g => new TopMovieViewDTO
                {
                    MovieName = g.Key.Title,
                    TotalViews = g.Sum(e => e.ViewCount)
                })
                .OrderByDescending(m => m.TotalViews)
                .Take(limit)
                .ToListAsync();
            return topMovies;
        }

        public async Task<IEnumerable<RecentActivityDTO>> GetRecentActivitiesAsync(int limit)
        {
            // Lấy hoạt động đăng kí tài khoản
            var recentRegisters = await _context.Users
                .Select(u => new RecentActivityDTO
                {
                    ActivityType = "Register",
                    Description = $"{u.FullName} đã đăng ký tài khoản",
                    Timestamp = u.RegisterDate ?? DateTime.Now,
                    Icon = "fa-solid fa-user-plus"
                }).ToListAsync();

            // Lấy hoạt động xem phim
            var recentWatch = await _context.WatchHistories
                .Include(w => w.User)
                .Include(w => w.Episode).ThenInclude(e => e.Movie)
                .Select(w => new RecentActivityDTO
                {
                    ActivityType = "Watch",
                    Description = $"{w.User.FullName} đã xem tập \"{w.Episode.EpisodeTitle}\" của phim \"{w.Episode.Movie.Title}\"",
                    Timestamp = w.WatchedAt,
                    Icon = "fa-solid fa-eye"
                }).ToListAsync();

            // Lấy hoạt động đánh giá phim
            var recentReviews = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Movie)
                .Select(r => new RecentActivityDTO
                {
                    ActivityType = "Review",
                    Description = $"{r.User.FullName} đã đánh giá phim \"{r.Movie.Title}\" {r.Rating}",
                    Timestamp = r.Timestamp,
                    Icon = "fa-solid fa-star"
                }).ToListAsync();

            // Lấy hoạt động bình luận phim
            var recentComments = await _context.Comments
                .Include(c => c.User)
                .Include(c => c.Episode).ThenInclude(e => e.Movie)
                .Select(c => new RecentActivityDTO
                {
                    ActivityType = "Comment",
                    Description = $"{c.User.FullName} đã bình luận vào tập \"{c.Episode.EpisodeTitle}\" của phim \"{c.Episode.Movie.Title}\"",
                    Timestamp = c.Timestamp,
                    Icon = "fa-solid fa-comment"
                }).ToListAsync();

            // Kết hợp tất cả hoạt động lại với nhau
            var combinedRaw = recentRegisters
                .Concat(recentWatch)
                .Concat(recentReviews)
                .Concat(recentComments)
                .OrderByDescending(x => x.Timestamp)
                .Take(limit)
                .ToList();

            foreach (var item in combinedRaw)
            {
                item.RelativeTime = GetRelativeTime(item.Timestamp);
            }

            return combinedRaw;
        }


        private string GetRelativeTime(DateTime dateTime)
        {
            var ts = DateTime.Now - dateTime;
            if (ts.TotalSeconds < 10)
                return "Vừa xong";
            if (ts.TotalSeconds < 60)
                return $"{ts.Seconds} giây trước";
            if (ts.TotalMinutes < 60)
                return $"{ts.Minutes} phút trước";
            if (ts.TotalHours < 24)
                return $"{ts.Hours} giờ trước";
            if (ts.TotalDays < 2)
                return $"hôm qua";
            if (ts.TotalDays < 30)
                return $"{ts.Days} ngày trước";
            if (ts.TotalDays < 365)
                return $"{(int)(ts.TotalDays / 30)} tháng trước";

            return $"{(int)(ts.TotalDays / 365)} năm trước";
        }
    }
}