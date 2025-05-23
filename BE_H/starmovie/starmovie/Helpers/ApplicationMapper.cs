﻿using AutoMapper;
using starmovie.Data;
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

            CreateMap<Episode, EpisodeDTO>()
             .ForMember(dest => dest.MovieTitle, opt => opt.MapFrom(src => src.Movie.Title))  // Lấy tên phim từ Movie
             .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => src.Duration.ToString(@"hh\:mm\:ss")));  // Chuyển TimeSpan thành string theo định dạng hh:mm:ss

            // Ánh xạ từ EpisodeDTO sang Episode
            CreateMap<EpisodeDTO, Episode>()
                .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => TimeSpan.Parse(src.Duration)))  // Chuyển string thành TimeSpan
                .ForMember(dest => dest.Movie, opt => opt.Ignore())  // Bỏ qua ánh xạ Movie
                .ForMember(dest => dest.Comments, opt => opt.Ignore())  // Bỏ qua Comments
                .ForMember(dest => dest.WatchHistories, opt => opt.Ignore());  // Bỏ qua WatchHistories
                                                                               //Ánh xạ     
            CreateMap<MovieSlide, MovieSlideDTO>()
                .ForMember(dest => dest.Movie, opt => opt.MapFrom(src => src.Movie));
            CreateMap<MovieSlideDTO, MovieSlide>();
            CreateMap<ApplicationUser, UserDTO>()
                .ForMember(dest => dest.Role, opt => opt.Ignore()); // Lấy Role riêng
            CreateMap<UserDTO, ApplicationUser>();
            CreateMap<Review, ReviewDTO>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.FullName))
                .ForMember(dest => dest.MovieTitle, opt => opt.MapFrom(src => src.Movie.Title));
            CreateMap<ReviewDTO, Review>()
                .ForMember(dest => dest.User, opt => opt.Ignore())   // Không map navigation
                .ForMember(dest => dest.Movie, opt => opt.Ignore());
            CreateMap<VipTypeDTO, VipType>()
                .ReverseMap();
            CreateMap<Vip, VipDTO>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.FullName))
                .ForMember(dest => dest.VipTypeName, opt => opt.MapFrom(src => src.VipType.TypeName));
            CreateMap<VipDTO, Vip>()
                .ForMember(dest => dest.User, opt => opt.Ignore());  // Không map navigation
            CreateMap<Comment, CommentDTO>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.User.FullName))
                .ForMember(dest => dest.EpisodeTitle, opt => opt.MapFrom(src => src.Episode.EpisodeTitle))
                .ForMember(dest => dest.MovieTitle, opt => opt.MapFrom(src => src.Episode.Movie.Title))
                .ForMember(dest => dest.ParentContent, opt => opt.MapFrom(src => src.ParentComment != null ? src.ParentComment.Content : null));
            CreateMap<CommentDTO, Comment>()
                .ForMember(dest => dest.User, opt => opt.Ignore()) // không map User object
                .ForMember(dest => dest.Episode, opt => opt.Ignore()) // không map Episode object
                .ForMember(dest => dest.ParentComment, opt => opt.Ignore()) // không map ParentComment
                .ForMember(dest => dest.CommentLikes, opt => opt.Ignore()); // nếu có
        }
    }
}
