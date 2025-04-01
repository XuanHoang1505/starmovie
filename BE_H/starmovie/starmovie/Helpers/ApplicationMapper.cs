using AutoMapper;
using starmovie.Data.Domain;
using starmovie.Models;

namespace starmovie.Helpers
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper()
        {
            //  Map GenreDTO <-> Genre
            CreateMap<GenreDTO, Genre>()
                .ForMember(dest => dest.GenreName, opt => opt.MapFrom(src => src.Name))
                .ReverseMap();

            //  Map CategoryDTO <-> Category
            CreateMap<CategoryDTO, Category>().ReverseMap();

            //  Map ActorDTO <-> Actor (Chuyển đổi ngày sinh)
            CreateMap<ActorDTO, Actor>()
                .ForMember(dest => dest.BirthDate, opt => opt.MapFrom(src => DateTime.ParseExact(src.BirthDate, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture)))
                .ReverseMap()
                .ForMember(dest => dest.BirthDate, opt => opt.MapFrom(src => src.BirthDate.ToString("yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture)));

            //  Map Movie -> MovieDTO (Lấy thêm thông tin thể loại & danh mục)
            CreateMap<Movie, MovieDTO>()
                .ForMember(dest => dest.Genres, opt => opt.MapFrom(src => src.MovieGenres.Select(mg => new GenreDTO
                {
                    GenreID = mg.Genre.GenreID,
                    Name = mg.Genre.GenreName
                }).ToList()))
                .ForMember(dest => dest.Categories, opt => opt.MapFrom(src => src.MovieCategories.Select(mc => new CategoryDTO
                {
                    CategoryID = mc.Category.CategoryID,
                    CategoryName = mc.Category.CategoryName
                }).ToList()));

            //  Map MovieDTO -> Movie (Chỉ cập nhật dữ liệu cơ bản, bỏ qua MovieGenres & MovieCategories)
            CreateMap<MovieDTO, Movie>()
                .ForMember(dest => dest.MovieGenres, opt => opt.MapFrom((src, dest) =>
                    src.Genres.Select(g => new Movie_Genre { MovieID = dest.MovieID, GenreID = g.GenreID }).ToList()))
                .ForMember(dest => dest.MovieCategories, opt => opt.MapFrom((src, dest) =>
                    src.Categories.Select(c => new Movie_Category { MovieID = dest.MovieID, CategoryID = c.CategoryID }).ToList()));

        }
    }
}
