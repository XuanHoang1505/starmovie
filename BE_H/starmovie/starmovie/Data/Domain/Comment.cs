using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace starmovie.Data.Domain
{
    public class Comment
    {
        [Key]
        public int CommentID { get; set; }
        public string UserID { get; set; }
        public int EpisodeID { get; set; }
        [Required, StringLength(500)]
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }
        public int ParentCommentID { get; set; }
        [ForeignKey("UserID")]
        public ApplicationUser User { get; set; }
        [ForeignKey("EpisodeID")]
        public Episode Episode { get; set; }
        public List<User_Comment_Like> CommentLikes { get; set; }
    }
}
