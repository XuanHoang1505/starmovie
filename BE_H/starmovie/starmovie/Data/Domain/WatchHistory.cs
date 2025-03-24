using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace starmovie.Data.Domain
{
    public class WatchHistory
    {
        [Key]
        public int HistoryID { get; set; }
        public string UserID { get; set; }
        public int MovieID { get; set; }
        public DateTime WatchDate { get; set; }

        [ForeignKey("UserID")]
        public ApplicationUser User { get; set; }

        [ForeignKey("MovieID")]
        public Movie Movie { get; set; }
    }
}
