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
            CreateMap<CategoryDTO, Category>().ReverseMap();
            CreateMap<ActorDTO, Actor>()
                .ForMember(dest => dest.BirthDate, opt => opt.MapFrom(src => DateTime.ParseExact(src.BirthDate, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture)))
                .ReverseMap()
                .ForMember(dest => dest.BirthDate, opt => opt.MapFrom(src => src.BirthDate.ToString("yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture)));
        }
    }
}
