using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace starmovie.Data.Domain
{
    public class Comment
    {
        [Key]
        public int CommentID { get; set; }

        public string UserID { get; set; }
        public int MovieID { get; set; }

        [StringLength(255)]
        public string Content { get; set; }

        public DateTime Timestamp { get; set; }

        public int? ParentCommentID { get; set; }

        [ForeignKey("UserID")]
        public ApplicationUser User { get; set; }

        [ForeignKey("MovieID")]
        public Movie Movie { get; set; }
    }
}
