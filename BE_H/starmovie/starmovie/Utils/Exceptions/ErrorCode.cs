namespace StarMovie.Utils.Exceptions
{
    public enum ErrorCode
    {
        // 🔹 Lỗi xác thực (Authentication Errors)

        /// <summary>
        /// Đăng nhập không thành công do sai email/mật khẩu.
        /// </summary>
        InvalidLogin = 1001,

        /// <summary>
        /// Người dùng không có quyền truy cập tài nguyên này.
        /// </summary>
        UnauthorizedAccess = 1002,

        // 🔹 Lỗi tài khoản và người dùng (User & Account Errors)

        /// <summary>
        /// Email đã tồn tại trong hệ thống, không thể đăng ký mới.
        /// </summary>
        EmailAlreadyExists = 2001,

        /// <summary>
        /// Số điện thoại đã tồn tại trong hệ thống, không thể đăng ký mới.
        /// </summary>
        PhoneNumberAlreadyExists = 2002,

        /// <summary>
        /// Không tìm thấy thông tin người dùng trong hệ thống.
        /// </summary>
        UserNotFound = 2003,

        /// <summary>
        /// Tài khoản đã bị khóa do vi phạm quy tắc hoặc quá nhiều lần đăng nhập thất bại.
        /// </summary>
        AccountLocked = 2004,

        // Lỗi hệ thống và máy chủ (System Errors)

        /// <summary>
        /// Lỗi máy chủ nội bộ, thường là do lỗi logic hoặc kết nối database thất bại.
        /// </summary>
        InternalServerError = 5000,

        /// <summary>
        /// Dịch vụ hiện không khả dụng, có thể do bảo trì hoặc quá tải.
        /// </summary>
        ServiceUnavailable = 5001,

        // Lỗi dữ liệu không hợp lệ (Validation Errors)

        /// <summary>
        /// Định dạng email không hợp lệ (ví dụ: thiếu @ hoặc .com).
        /// </summary>
        InvalidEmailFormat = 3001,

        /// <summary>
        /// Dữ liệu đầu vào không hợp lệ hoặc thiếu thông tin bắt buộc.
        /// </summary>
        InvalidInput = 3002,

        /// <summary>
        /// Mật khẩu quá yếu, không đáp ứng tiêu chí bảo mật (ví dụ: quá ngắn, thiếu ký tự đặc biệt).
        /// </summary>
        PasswordTooWeak = 3003,

        // Lỗi tài nguyên không tìm thấy (Resource Not Found Errors)

        /// <summary>
        /// Không tìm thấy tài nguyên yêu cầu, có thể là một URL không hợp lệ hoặc dữ liệu đã bị xóa.
        /// </summary>
        ResourceNotFound = 4001,

        // Lỗi xung đột, thường xảy ra khi có sự cố với dữ liệu (ví dụ: cố gắng tạo một bản ghi đã tồn tại).
        ConflictError = 409,
    }
}
