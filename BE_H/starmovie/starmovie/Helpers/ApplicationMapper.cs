using AutoMapper;
using starmovie.Data;
using starmovie.Models;

namespace starmovie.Helpers
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper() {                
            CreateMap<Book, BookModel>().ReverseMap();
        }
    }
}
