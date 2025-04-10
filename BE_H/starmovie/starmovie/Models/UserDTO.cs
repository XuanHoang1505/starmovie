using System.Text.Json.Serialization;
using starmovie.Enums;

public class UserDTO
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }
    [JsonPropertyName("fullName")]
    public string FullName { get; set; }
    [JsonPropertyName("phoneNumber")]
    public string? PhoneNumber { get; set; }
    [JsonPropertyName("avatar")]
    public string? Avatar { get; set; }
    [JsonPropertyName("birthDate")]
    public DateTime? BirthDate { get; set; }
    [JsonPropertyName("gender")]
    public bool? Gender { get; set; } // true: nam, false: nữ
    [JsonPropertyName("username")]
    public string? UserName { get; set; }
    [JsonPropertyName("email")]
    public string Email { get; set; }
    [JsonPropertyName("role")]
    public string Role { get; set; }

    [JsonPropertyName("registeredDate")]
    public DateTime? RegisterDate { get; set; }
    [JsonPropertyName("lastLogin")]
    public DateTime? LastLogin { get; set; }
    [JsonPropertyName("status")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public UserStatus Status { get; set; }
}
