using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace starmovie.Data.Domain
{
    [PrimaryKey(nameof(MovieID), nameof(ActorID))]
    public class Movie_Actor
    {
        public int MovieID { get; set; }
        public int ActorID { get; set; }

        [ForeignKey("MovieID")]
        public Movie Movie { get; set; }

        [ForeignKey("ActorID")]
        public Actor Actor { get; set; }
    }
}
