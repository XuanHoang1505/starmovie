using AutoMapper;
using Microsoft.EntityFrameworkCore;
using starmovie.Data;
using starmovie.Data.Domain;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using StarMovie.Utils.Exceptions;

namespace starmovie.Repositories.Implementations
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly MovieContext _context;
        private readonly IMapper _mapper;

        public ReviewRepository(MovieContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ReviewDTO>> GetAllReviewsAsync()
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Movie)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ReviewDTO>>(reviews);
        }

        public async Task<ReviewDTO> GetReviewByIdAsync(int id)
        {
            var review = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Movie)
                .FirstOrDefaultAsync(r => r.ReviewID == id);

            return review == null ? null : _mapper.Map<ReviewDTO>(review);
        }

        public async Task<IEnumerable<ReviewDTO>> GetReviewsByMovieIdAsync(int movieId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Where(r => r.MovieID == movieId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ReviewDTO>>(reviews);
        }

        public async Task<IEnumerable<ReviewDTO>> GetReviewsByUserIdAsync(string userId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.Movie)
                .Where(r => r.UserID == userId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ReviewDTO>>(reviews);
        }

        public async Task<ReviewDTO> CreateReviewAsync(ReviewDTO dto, string currentUserId)
        {
            // Kiểm tra người dùng đã đánh giá phim này chưa
            var existingReview = await _context.Reviews
                .FirstOrDefaultAsync(r => r.UserID == currentUserId && r.MovieID == dto.MovieID);

            if (existingReview != null)
            {
                throw new AppException(ErrorCode.ConflictError, "Bạn đã đánh giá bộ phim này rồi.");
            }

            var review = _mapper.Map<Review>(dto);
            review.UserID = currentUserId; // Gán từ token
            review.Timestamp = DateTime.UtcNow;

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            var createdReview = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Movie)
                .FirstOrDefaultAsync(r => r.ReviewID == review.ReviewID);

            return _mapper.Map<ReviewDTO>(createdReview);
        }



        public async Task<bool> UpdateReviewAsync(int id, ReviewDTO dto, string currentUserId, bool isAdmin = false)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
                throw new AppException(ErrorCode.ReviewNotFound, "Không tìm thấy đánh giá cần cập nhật.");

            if (!isAdmin && review.UserID != currentUserId)
                throw new AppException(ErrorCode.Forbidden, "Bạn không có quyền sửa đánh giá này.");

            review.Rating = dto.Rating;
            review.Comment = dto.Comment;
            review.Timestamp = DateTime.UtcNow;

            _context.Reviews.Update(review);
            await _context.SaveChangesAsync();
            return true;
        }



        public async Task<bool> DeleteReviewAsync(int id, string currentUserId, bool isAdmin = false)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
                throw new AppException(ErrorCode.ReviewNotFound, "Không tìm thấy đánh giá để xóa.");

            if (!isAdmin && review.UserID != currentUserId)
                throw new AppException(ErrorCode.Forbidden, "Bạn không có quyền xóa đánh giá này.");

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return true;
        }


    }
}