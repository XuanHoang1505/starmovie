using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace starmovie.Data.Domain
{
    public class WatchHistory
    {
        [Key]
        public int WatchHistoryID { get; set; }
        public string UserID { get; set; }
        public int EpisodeID { get; set; }
        public DateTime WatchedAt { get; set; }
        [ForeignKey("UserID")]
        public ApplicationUser User { get; set; }
        [ForeignKey("EpisodeID")]
        public Episode Episode { get; set; }
    }
}
