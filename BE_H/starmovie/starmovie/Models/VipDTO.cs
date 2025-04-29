using System.Text.Json.Serialization;

namespace starmovie.Models
{
    public class VipDTO
    {
        [JsonPropertyName("id")]
        public int VipID { get; set; }
        [JsonPropertyName("userId")]
        public string UserID { get; set; }
        [JsonPropertyName("vipTypeId")]
        public int VipTypeID { get; set; }
        [JsonPropertyName("registeredDate")]
        public DateTime? RegisteredDate { get; set; }
        [JsonPropertyName("expirationDate")]
        public DateTime? ExpirationDate { get; set; }
        [JsonPropertyName("username")]
        public string? UserName { get; set; }
        [JsonPropertyName("vipTypeName")]
        public string? VipTypeName { get; set; }
    }
}