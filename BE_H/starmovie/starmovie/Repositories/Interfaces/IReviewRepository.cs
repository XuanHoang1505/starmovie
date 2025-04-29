using starmovie.Models;

namespace starmovie.Repositories.Interfaces
{
    public interface IReviewRepository
    {
        Task<IEnumerable<ReviewDTO>> GetAllReviewsAsync();
        Task<ReviewDTO> GetReviewByIdAsync(int id);
        Task<IEnumerable<ReviewDTO>> GetReviewsByMovieIdAsync(int movieId);
        Task<IEnumerable<ReviewDTO>> GetReviewsByUserIdAsync(string userId);
        Task<ReviewDTO> CreateReviewAsync(ReviewDTO dto, string currentUserId);
        Task<bool> UpdateReviewAsync(int id, ReviewDTO dto, string currentUserId, bool isAdmin);
        Task<bool> DeleteReviewAsync(int id, string currentUserId, bool isAdmin);
    }
}