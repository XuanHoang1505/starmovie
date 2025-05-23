package com.movie.starmovie.utils.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Xử lý AppException tổng quát với ErrorCode
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorResponse> handleAppException(AppException ex, WebRequest request) {
        HttpStatus status = getStatusByErrorCode(ex.getErrorCode());
        ErrorResponse errorResponse = new ErrorResponse(
                status.value(),
                ex.getMessage(),
                ex.getErrorCode());
        return new ResponseEntity<>(errorResponse, status);
    }

    // Xử lý ngoại lệ DataIntegrityViolationException (Lỗi khóa ngoại)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(DataIntegrityViolationException ex,
            WebRequest request) {
        // Kiểm tra và xử lý lỗi khóa ngoại
        if (ex.getMessage() != null && ex.getMessage().contains("foreign key constraint")) {
            ErrorResponse errorResponse = new ErrorResponse(
                    HttpStatus.CONFLICT.value(),
                    "Không thể xóa vì bản ghi này đang liên kết với bảng khác!",
                    ErrorCode.CONFLICT_ERROR);
            return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        }

        // Xử lý các lỗi khác liên quan đến DataIntegrityViolationException
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Lỗi ràng buộc dữ liệu!",
                ErrorCode.DATABASE_ERROR);
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Xử lý ngoại lệ không mong đợi
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception ex, WebRequest request) {
        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.",
                ErrorCode.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Xác định HttpStatus dựa trên ErrorCode
    private HttpStatus getStatusByErrorCode(ErrorCode errorCode) {
        return switch (errorCode) {
            case INVALID_LOGIN, UNAUTHORIZED_ACCESS -> HttpStatus.UNAUTHORIZED;
            case EMAIL_ALREADY_EXISTS, TICKET_IN_USE, PHONE_NUMBER_ALREADY_EXISTS, CONFLICT_ERROR, DUPLICATE_ENTRY,
                    DUPLICATE_TIMESLOT ->
                HttpStatus.CONFLICT;
            case USER_NOT_FOUND, RESOURCE_NOT_FOUND, ORDER_NOT_FOUND, PRODUCT_NOT_FOUND, COURSE_NOT_FOUND,
                    STUDENT_NOT_FOUND, TRAINER_NOT_FOUND, DISCOUNT_NOT_FOUND, EMPLOYEE_NOT_FOUND, CATEGORY_NOT_FOUND,
                    TICKET_NOT_FOUND, TIMESLOT_NOT_FOUND, ATTENDANCE_NOT_FOUND, NOTIFICATION_NOT_FOUND, CLASS_NOT_FOUND,
                    ENROLLMENT_NOT_FOUND,
                    TICKET_PRICE_NOT_FOUND ->
                HttpStatus.NOT_FOUND;
            case INVALID_INPUT, INVALID_EMAIL_FORMAT, PASSWORD_TOO_WEAK, INVALID_PHONE_NUMBER, INVALID_ORDER_DETAILS,
                    INVALID_EMAIL, INVALID_OTP, TICKET_EXPIRED, INVALID_OPERATION, INVALID_QR_CODE, SLOT_FULL,
                    INVALID_TICKET_TYPE, INSUFFICIENT_PRODUCT_QUANTITY, SESSION_GENERATION_FAILED,
                    CLASS_CREATION_FAILED ->
                HttpStatus.BAD_REQUEST;
            case INTERNAL_SERVER_ERROR, SERVICE_UNAVAILABLE, DATABASE_ERROR, TIMEOUT_ERROR, EMAIL_SEND_FAILURE,
                    EMAIL_CONFIG_ERROR, ACCOUNT_LOCKED ->
                HttpStatus.INTERNAL_SERVER_ERROR;
            case OPERATION_NOT_ALLOWED, PERMISSION_DENIED, OPERATION_FAILED -> HttpStatus.FORBIDDEN;
            case MISSING_REQUIRED_PARAMETER, PARAMETER_VALIDATION_FAILED -> HttpStatus.BAD_REQUEST;
            case DATA_PROCESSING_ERROR, FILE_UPLOAD_ERROR, FILE_FORMAT_NOT_SUPPORTED ->
                HttpStatus.INTERNAL_SERVER_ERROR;
            case UNKNOWN_ERROR -> HttpStatus.INTERNAL_SERVER_ERROR;
            default -> throw new IllegalArgumentException("Unexpected value: " + errorCode);
        };
    }

}
