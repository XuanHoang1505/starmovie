using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace starmovie.Data.Domain
{
    [PrimaryKey(nameof(UserID), nameof(CommentID))]
    public class User_Comment_Like
    {
        public string UserID { get; set; }
        public int CommentID { get; set; }

        public DateTime Timestamp { get; set; }

        [ForeignKey("UserID")]
        public ApplicationUser User { get; set; }

        [ForeignKey("CommentID")]
        public Comment Comment { get; set; }
    }
}
