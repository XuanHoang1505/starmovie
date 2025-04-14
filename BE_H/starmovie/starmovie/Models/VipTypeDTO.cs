using System.Text.Json.Serialization;

namespace starmovie.Models
{
    public class VipTypeDTO
    {
        [JsonPropertyName("id")]
        public int? VipTypeID { get; set; }
        [JsonPropertyName("typeName")]
        public string TypeName { get; set; }
        [JsonPropertyName("price")]
        public double Price { get; set; }
    }
}