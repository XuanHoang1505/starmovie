using AutoMapper;
using starmovie.Data.Domain;
using starmovie.Models;

namespace starmovie.Helpers
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper()
        {
            CreateMap<Book, BookModel>().ReverseMap();
            CreateMap<GenreDTO, Genre>()
            .ForMember(dest => dest.GenreName, opt => opt.MapFrom(src => src.Name))
            .ReverseMap();
        }
    }
}
