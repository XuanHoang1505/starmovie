namespace starmovie.Models
{
    public class RecentActivityDTO
    {
        public string ActivityType { get; set; } // e.g., "Register", "Watch", "Comment", etc.
        public string Description { get; set; }  // e.g., "Nguyễn Văn A đã xem tập 2 của phim A"
        public string RelativeTime { get; set; }
        public DateTime Timestamp { get; set; } // The timestamp of the activity
        public string Icon { get; set; }
    }

}