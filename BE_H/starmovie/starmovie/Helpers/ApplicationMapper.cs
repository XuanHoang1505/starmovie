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
        }
    }
}
