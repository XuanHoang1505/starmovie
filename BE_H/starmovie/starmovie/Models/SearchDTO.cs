namespace starmovie.Models
{
    public class SearchDTO
    {
        public IEnumerable<MovieDTO> Movies { get; set; }
        public IEnumerable<ActorDTO> Actors { get; set; }
    }
}