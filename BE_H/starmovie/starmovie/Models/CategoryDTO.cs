using System.Text.Json.Serialization;

namespace starmovie.Models
{
    public class CategoryDTO
    {
        [JsonPropertyName("id")]
        public int CategoryID { get; set; }
        [JsonPropertyName("categoryName")]
        public string CategoryName { get; set; }
    }
}