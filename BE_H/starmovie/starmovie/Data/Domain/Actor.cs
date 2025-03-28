using System.ComponentModel.DataAnnotations;

namespace starmovie.Data.Domain
{
    public class Actor
    {
        [Key]
        public int ActorID { get; set; }
        [Required, StringLength(50)]
        public string Name { get; set; }
        [Required]
        public DateTime BirthDate { get; set; }
        [StringLength(30)]
        public string Nationality { get; set; }
        public List<Movie_Actor> MovieActors { get; set; }
    }
}
