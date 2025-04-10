
using System.Net;
using System.Text.Json;

namespace StarMovie.Utils.Exceptions
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Đã xảy ra lỗi không mong muốn");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var response = context.Response;
            response.ContentType = "application/json";

            var errorCode = ErrorCode.InternalServerError; // Mặc định là lỗi hệ thống
            var statusCode = (int)HttpStatusCode.InternalServerError;
            string message = "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.";

            if (exception is AppException appEx)
            {
                errorCode = appEx.ErrorCode;
                statusCode = GetStatusCode(appEx.ErrorCode);
                message = appEx.Message;
            }

            response.StatusCode = statusCode;
            var errorResponse = new
            {
                status = statusCode,
                message,
                errorCode = errorCode.ToString()
            };

            return response.WriteAsync(JsonSerializer.Serialize(errorResponse));
        }

        private static int GetStatusCode(ErrorCode errorCode)
        {
            return errorCode switch
            {
                ErrorCode.InvalidLogin => (int)HttpStatusCode.Unauthorized,
                ErrorCode.EmailAlreadyExists => (int)HttpStatusCode.Conflict,
                ErrorCode.UserNotFound => (int)HttpStatusCode.NotFound,
                ErrorCode.InvalidInput => (int)HttpStatusCode.BadRequest,
                ErrorCode.InternalServerError => (int)HttpStatusCode.InternalServerError,
                _ => (int)HttpStatusCode.InternalServerError
            };
        }
    }
}
