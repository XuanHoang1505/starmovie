using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace starmovie.Data.Domain
{
    public class Review
    {
        [Key]
        public int ReviewID { get; set; }

        public string UserID { get; set; }
        public int MovieID { get; set; }
        public int Rating { get; set; }

        [StringLength(255)]
        public string Comment { get; set; }

        public DateTime Timestamp { get; set; }

        [ForeignKey("UserID")]
        public ApplicationUser User { get; set; }

        [ForeignKey("MovieID")]
        public Movie Movie { get; set; }
    }
}
