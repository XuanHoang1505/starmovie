using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace starmovie.Data.Domain
{
    public class Actor
    {
        [Key]
        public int ActorID { get; set; }

        [Required, StringLength(50)]
        public string Name { get; set; }

        public DateTime BirthDay { get; set; }

        [StringLength(30)]
        public string Nationality { get; set; }
    }
}
