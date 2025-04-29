using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using starmovie.Data.Domain;
using starmovie.Enums;

namespace starmovie.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { set; get; }

        [StringLength(255)]
        public string? Avatar { get; set; }

        public bool? Gender { get; set; }

        public DateTime? BirthDate { get; set; }

        public DateTime? RegisterDate { get; set; }

        public DateTime? LastLogin { get; set; }

        public UserStatus Status { get; set; } = UserStatus.ACTIVE;
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }

        public ICollection<Review> Reviews { get; set; }
        public ICollection<WatchHistory> WatchHistories { get; set; }
        public ICollection<User_FollowActor> UserFollowActors { get; set; }
        public ICollection<User_Comment_Like> likes { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<User_Movie_Favorite> FavoriteMovies { get; set; }
    }
}
