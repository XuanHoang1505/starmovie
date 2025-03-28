using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using starmovie.Data.Domain;

namespace starmovie.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { set; get; }
        [StringLength(15)]
        public string PhoneNumber { get; set; }
        [StringLength(255)]
        public string Avatar { get; set; }

        public string Gender { get; set; }

        public DateTime BirthDate { get; set; }

        public ICollection<Review> Reviews { get; set; }
        public ICollection<WatchHistory> WatchHistories { get; set; }
        public ICollection<User_FollowActor> UserFollowActors { get; set; }
        public ICollection<User_Comment_Like> likes { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<User_Movie_Favorite> FavoriteMovies { get; set; }
    }
}
