using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace starmovie.Data.Domain
{
    [PrimaryKey(nameof(UserID), nameof(ActorID))]
    public class User_FollowActor
    {
        public string UserID { get; set; }  // Vì Id của ApplicationUser là string (mặc định của Identity)
        public int ActorID { get; set; }

        [ForeignKey("UserID")]
        public ApplicationUser User { get; set; }

        [ForeignKey("ActorID")]
        public Actor Actor { get; set; }
    }
}
