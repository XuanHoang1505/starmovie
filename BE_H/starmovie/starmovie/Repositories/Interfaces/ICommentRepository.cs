using starmovie.Models;

namespace starmovie.Repositories.Interfaces
{
    public interface ICommentRepository
    {
        Task<IEnumerable<CommentDTO>> GetAllCommentsAsync();
        Task<CommentDTO> GetCommentByIdAsync(int id);
        Task<IEnumerable<CommentDTO>> GetCommentsByEpisodeIdAsync(int episodeId);
        Task<IEnumerable<CommentDTO>> GetCommentsByUserIdAsync(string userId);
        Task<IEnumerable<CommentDTO>> GetParentCommentsAsync(int episodeId);
        Task<IEnumerable<CommentDTO>> GetChildCommentsAsync(int parentCommentId);
        Task<CommentDTO> CreateCommentAsync(CommentDTO dto, string currentUserId);
        Task<CommentDTO> UpdateCommentAsync(int id, CommentDTO dto, string currentUserId, bool isAdmin);
        Task<bool> DeleteCommentAsync(int id, string currentUserId, bool isAdmin);
    }
}