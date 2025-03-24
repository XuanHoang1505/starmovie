using System.ComponentModel.DataAnnotations;

namespace starmovie.Models
{
    public class SignUpModel
    {
        [Required]
        public string FullName { set; get; }
        [Required]
        public string PhoneNumber { set; get; }
        [Required, EmailAddress]
        public string Email { set; get; }
        [Required]
        public string Password { set; get; }
        [Required]
        public string ConfirmPassword { set; get; }
    }
}
