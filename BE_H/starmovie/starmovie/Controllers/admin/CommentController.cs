using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using System.Security.Claims;
using StarMovie.Utils.Exceptions;

namespace starmovie.Controllers
{
    [Route("api/comments")]
    [ApiController]
    [Authorize]
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepository;

        public CommentController(ICommentRepository commentRepository)
        {
            _commentRepository = commentRepository;
        }

        private string GetUserIdFromToken()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        private bool IsAdmin()
        {
            return User.IsInRole("ADMIN");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentDTO>>> GetComments()
        {
            return Ok(await _commentRepository.GetAllCommentsAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CommentDTO>> GetComment(int id)
        {
            var comment = await _commentRepository.GetCommentByIdAsync(id);
            if (comment == null)
                return NotFound();
            return Ok(comment);
        }

        [HttpGet("episode/{episodeId}")]
        public async Task<ActionResult<IEnumerable<CommentDTO>>> GetCommentByEpisodeId(int episodeId)
        {
            var comments = await _commentRepository.GetCommentsByEpisodeIdAsync(episodeId);
            if (comments == null || !comments.Any())
                return NotFound("Tập phim không có bình luận.");
            return Ok(comments);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<CommentDTO>>> GetCommentByUserId(string userId)
        {
            var comments = await _commentRepository.GetCommentsByUserIdAsync(userId);
            return Ok(comments);
        }

        [HttpPost]
        public async Task<ActionResult<CommentDTO>> CreateComment([FromBody] CommentDTO dto)
        {
            try
            {
                string userId = IsAdmin() ? dto.UserId : GetUserIdFromToken();
                var created = await _commentRepository.CreateCommentAsync(dto, userId);
                return CreatedAtAction(nameof(GetComment), new { id = created.CommentID }, created);
            }
            catch (AppException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CommentDTO>> UpdateComment(int id, [FromBody] CommentDTO dto)
        {
            try
            {
                string userId = GetUserIdFromToken();

                // Cập nhật bình luận
                var updatedComment = await _commentRepository.UpdateCommentAsync(id, dto, userId, IsAdmin());

                if (updatedComment == null)
                    return NotFound(new { message = "Không tìm thấy bình luận cần cập nhật." });

                // Trả về đối tượng CommentDTO đã được cập nhật
                return Ok(updatedComment);
            }
            catch (AppException ex)
            {
                return StatusCode(403, new { message = $"Bạn không có quyền sửa bình luận này: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            try
            {
                string userId = GetUserIdFromToken();
                var success = await _commentRepository.DeleteCommentAsync(id, userId, IsAdmin());
                if (!success) return NotFound();
                return NoContent();
            }
            catch (AppException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
        }
    }
}
