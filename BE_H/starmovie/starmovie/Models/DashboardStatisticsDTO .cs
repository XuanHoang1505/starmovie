using System.Text.Json.Serialization;

namespace starmovie.Models
{
    public class DashboardStatisticsDTO
    {
        [JsonPropertyName("totalUsers")]
        public long TotalUsers { get; set; }           // Tổng người dùng
        [JsonPropertyName("totalVipUsers")]
        public long TotalVipUsers { get; set; }        // Tổng người dùng VIP
        [JsonPropertyName("totalMovies")]
        public long TotalMovies { get; set; }          // Tổng số phim
        [JsonPropertyName("totalGenres")]
        public long TotalGenres { get; set; }          // Tổng số thể loại
                                                       // Tổng lượt xem phim
        [JsonPropertyName("totalRevenue")]
        public double TotalRevenue { get; set; }       // Tổng doanh thu
    }

}