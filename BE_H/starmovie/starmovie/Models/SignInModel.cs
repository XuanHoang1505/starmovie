using System.ComponentModel.DataAnnotations;

namespace starmovie.Models
{
    public class SignInModel
    {

        [Required, EmailAddress]
        public string Email { set; get; }
        [Required]
        public string Password { set; get; }
    }
}
