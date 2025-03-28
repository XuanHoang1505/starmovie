using System.ComponentModel.DataAnnotations;

namespace starmovie.Data.Domain
{
    public class VipType
    {
        [Key]
        public int VipTypeID { get; set; }
        [Required, StringLength(50)]
        public string TypeName { get; set; }
        [Required]
        public double Price { get; set; }
    }
}