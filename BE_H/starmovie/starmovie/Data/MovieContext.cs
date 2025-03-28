using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using starmovie.Data.Domain;

namespace starmovie.Data
{
    public class MovieContext : IdentityDbContext<ApplicationUser>
    {
        public MovieContext(DbContextOptions<MovieContext> options) : base(options)
        {

        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                var tableName = entityType.GetTableName();
                if (tableName.StartsWith("AspNet"))
                {
                    entityType.SetTableName(tableName.Substring(6));
                }
            }
        }
        public DbSet<Book> Books { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Movie_Category> MovieCategories { get; set; }
        public DbSet<MovieSlide> MovieSlides { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Episode> Episodes { get; set; }
        public DbSet<Movie_Genre> MovieGenres { get; set; }
        public DbSet<VipType> VipTypes { get; set; }
        public DbSet<Vip> Vips { get; set; }
        public DbSet<Actor> Actors { get; set; }
        public DbSet<Movie_Actor> MovieActors { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<WatchHistory> WatchHistories { get; set; }
        public DbSet<User_Movie_Favorite> UserMovieFavorites { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<User_Comment_Like> UserCommentLikes { get; set; }
        public DbSet<User_FollowActor> UserFollowActors { get; set; }
    }
}
