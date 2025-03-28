using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace starmovie.Data.Domain
{
    public class Vip
    {
        [Key]
        public int VipID { get; set; }
        public string UserID { get; set; }
        public int VipTypeID { get; set; }
        public DateTime RegisteredDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        [ForeignKey("UserID")]
        public ApplicationUser User { get; set; }
        [ForeignKey("VipTypeID")]
        public VipType VipType { get; set; }
    }
}