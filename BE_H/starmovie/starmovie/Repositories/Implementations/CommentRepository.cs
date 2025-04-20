using AutoMapper;
using Microsoft.EntityFrameworkCore;
using starmovie.Data;
using starmovie.Data.Domain;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using StarMovie.Utils.Exceptions;

namespace starmovie.Repositories.Implementations
{
    public class CommentRepository : ICommentRepository
    {
        private readonly MovieContext _context;
        private readonly IMapper _mapper;

        public CommentRepository(MovieContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CommentDTO>> GetAllCommentsAsync()
        {
            var comment = await _context.Comments
                .Include(r => r.User)
                .Include(r => r.Episode)
                .ThenInclude(e => e.Movie)
                .ToListAsync();

            return _mapper.Map<IEnumerable<CommentDTO>>(comment);
        }

        public async Task<CommentDTO> GetCommentByIdAsync(int id)
        {
            var review = await _context.Comments
                .Include(r => r.User)
                .Include(r => r.Episode)
                .ThenInclude(e => e.Movie)
                .FirstOrDefaultAsync(r => r.CommentID == id);

            return review == null ? null : _mapper.Map<CommentDTO>(review);
        }

        public async Task<IEnumerable<CommentDTO>> GetCommentsByEpisodeIdAsync(int episode)
        {
            var reviews = await _context.Comments
                .Include(r => r.User)
                .Where(r => r.EpisodeID == episode)
                .ToListAsync();

            return _mapper.Map<IEnumerable<CommentDTO>>(reviews);
        }

        public async Task<IEnumerable<CommentDTO>> GetCommentsByUserIdAsync(string userId)
        {
            var reviews = await _context.Comments
                .Include(r => r.Episode)
                .Where(r => r.UserID == userId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<CommentDTO>>(reviews);
        }

        public async Task<IEnumerable<CommentDTO>> GetParentCommentsAsync(int episodeId)
        {
            var parentComments = await _context.Comments
                .Where(c => c.EpisodeID == episodeId && c.ParentCommentID == null)
                .ToListAsync();

            return _mapper.Map<IEnumerable<CommentDTO>>(parentComments);
        }

        public async Task<IEnumerable<CommentDTO>> GetChildCommentsAsync(int parentCommentId)
        {
            var childComments = await _context.Comments
                .Where(c => c.ParentCommentID == parentCommentId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<CommentDTO>>(childComments);
        }

        public async Task<CommentDTO> CreateCommentAsync(CommentDTO dto, string currentUserId)
        {

            var comment = _mapper.Map<Comment>(dto);
            comment.UserID = currentUserId;
            comment.Timestamp = DateTime.Now;
            if (dto.ParentCommentId != null)
            {
                var parentComment = await _context.Comments.FindAsync(dto.ParentCommentId);
                if (parentComment == null)
                    throw new AppException(ErrorCode.CommentNotFound, "Không tìm thấy bình luận cha.");

                comment.ParentCommentID = dto.ParentCommentId;
            }

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            var createdComment = await _context.Comments
                .Include(r => r.User)
                .Include(r => r.Episode)
                .ThenInclude(e => e.Movie)
                .FirstOrDefaultAsync(r => r.CommentID == comment.CommentID);

            return _mapper.Map<CommentDTO>(createdComment);
        }



        public async Task<CommentDTO> UpdateCommentAsync(int id, CommentDTO dto, string currentUserId, bool isAdmin = false)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
                throw new AppException(ErrorCode.CommentNotFound, "Không tìm thấy bình luận cần cập nhật.");

            if (!isAdmin && comment.UserID != currentUserId)
                throw new AppException(ErrorCode.Forbidden, "Bạn không có quyền sửa bình luận này.");

            comment.Content = dto.Content;
            comment.Timestamp = DateTime.Now;

            _context.Comments.Update(comment);
            await _context.SaveChangesAsync();
            return _mapper.Map<CommentDTO>(comment);
        }



        public async Task<bool> DeleteCommentAsync(int id, string currentUserId, bool isAdmin = false)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
                throw new AppException(ErrorCode.CommentNotFound, "Không tìm thấy bình luận để xóa.");

            if (!isAdmin && comment.UserID != currentUserId)
                throw new AppException(ErrorCode.Forbidden, "Bạn không có quyền xóa bình luận này.");

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();
            return true;
        }

    }
}