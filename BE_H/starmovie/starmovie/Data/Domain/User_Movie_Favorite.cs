using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace starmovie.Data.Domain
{
    [PrimaryKey(nameof(UserID), nameof(MovieID))]
    public class User_Movie_Favorite
    {
        public string UserID { get; set; }  // Vì khóa chính của ApplicationUser là string
        public int MovieID { get; set; }

        [ForeignKey("UserID")]
        public ApplicationUser User { get; set; }

        [ForeignKey("MovieID")]
        public Movie Movie { get; set; }
    }
}
