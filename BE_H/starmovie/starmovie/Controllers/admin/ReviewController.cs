using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using starmovie.Models;
using starmovie.Repositories.Interfaces;
using System.Security.Claims;
using StarMovie.Utils.Exceptions;

namespace starmovie.Controllers
{
    [Route("api/reviews")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewRepository _reviewRepository;

        public ReviewController(IReviewRepository reviewRepository)
        {
            _reviewRepository = reviewRepository;
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
        public async Task<ActionResult<IEnumerable<ReviewDTO>>> GetReviews()
        {
            return Ok(await _reviewRepository.GetAllReviewsAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewDTO>> GetReview(int id)
        {
            var review = await _reviewRepository.GetReviewByIdAsync(id);
            if (review == null)
                return NotFound();
            return Ok(review);
        }

        [HttpGet("movie/{movieId}")]
        public async Task<ActionResult<IEnumerable<ReviewDTO>>> GetReviewByMovieId(int movieId)
        {
            var reviews = await _reviewRepository.GetReviewsByMovieIdAsync(movieId);
            if (reviews == null || !reviews.Any())
                return NotFound("Phim không có đánh giá.");
            return Ok(reviews);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ReviewDTO>>> GetReviewByUserId(string userId)
        {
            var reviews = await _reviewRepository.GetReviewsByUserIdAsync(userId);
            return Ok(reviews);
        }
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<ReviewDTO>> CreateReview([FromBody] ReviewDTO dto)
        {
            try
            {
                string userId = IsAdmin() ? dto.UserID : GetUserIdFromToken();
                var created = await _reviewRepository.CreateReviewAsync(dto, userId);
                return CreatedAtAction(nameof(GetReview), new { id = created.ReviewID }, created);
            }
            catch (AppException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] ReviewDTO dto)
        {
            try
            {
                string userId = GetUserIdFromToken();
                var success = await _reviewRepository.UpdateReviewAsync(id, dto, userId, IsAdmin());
                if (!success) return NotFound();
                return NoContent();
            }
            catch (AppException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            try
            {
                string userId = GetUserIdFromToken();
                var success = await _reviewRepository.DeleteReviewAsync(id, userId, IsAdmin());
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
