namespace starmovie.Models
{
    public class UserRegistrationChartDTO
    {
        public string Month { get; set; } = string.Empty;
        public int TotalUsers { get; set; }
        public int VipUsers { get; set; }

        public UserRegistrationChartDTO(string month, int totalUsers, int vipUsers)
        {
            Month = month;
            TotalUsers = totalUsers;
            VipUsers = vipUsers;
        }
    }

}