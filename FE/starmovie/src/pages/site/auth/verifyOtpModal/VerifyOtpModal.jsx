import { useState, useEffect, useRef } from "react";

import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import {
  verifyOtp,
  resendOtp,
  register,
} from "../../../../services/site/AuthService";
import styles from "./VerifyOtpModal.module.scss";

function VerifyOtpModal({
  show,
  handleCloseModal,
  otpInfo,
  handleBack,
  handleShowLoginModal,
  handleShowResetPasswordModal,
}) {
  const [otpArray, setOtpArray] = useState(Array(6).fill(""));
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  const identifier = otpInfo?.identifier;
  const userData = otpInfo?.userData;
  const inputRefs = useRef([]);

  // Cập nhật useEffect để countdown giảm tự động
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      setIsResendEnabled(true);
    }
  }, [countdown]);

  useEffect(() => {
    // Kiểm tra nếu không có identifier, chuyển hướng về trang login
    if (show && !identifier) {
      toast.error("Truy cập không hợp lệ, vui lòng thử lại!");
      handleShowLoginModal();
    }

    // Đặt countdown ban đầu
    setCountdown(60);
    setIsResendEnabled(false);
  }, [identifier, show]);

  const handleChangeOtp = (index, value) => {
    const newOtpArray = [...otpArray];
    newOtpArray[index] = value;
    setOtpArray(newOtpArray);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtpArray.every((digit) => digit !== "") && index === 5) {
      handleVerifyOtp(newOtpArray.join(""));
    }
  };

  const handlePasteOtp = (e) => {
    const pasteData = e.clipboardData.getData("Text").slice(0, 6);
    if (/^\d{6}$/.test(pasteData)) {
      setOtpArray(pasteData.split(""));
      handleVerifyOtp(pasteData);
    }
    e.preventDefault();
  };

  const validateOtp = (otp) => {
    const newErrors = {};
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      newErrors.otp = "Mã OTP phải gồm 6 chữ số.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyOtp = async (otp = otpArray.join("")) => {
    if (validateOtp(otp)) {
      try {
        setIsLoading(true);

        // Gọi API để xác thực OTP
        const message = await verifyOtp(identifier, otp);

        if (otpInfo.type === "REGISTER") {
          // Nếu là đăng ký (sử dụng email), lưu thông tin người dùng vào cơ sở dữ liệu
          const registerData = await register(userData);
          toast.success("Đăng ký thành công!");
          handleShowLoginModal();
        } else {
          handleShowResetPasswordModal(); // Hiển thị modal đặt lại mật khẩu
          toast.success(message);
        }
      } catch (error) {
        if (!error.response) {
          toast.error(
            "Không thể kết nối đến server, vui lòng kiểm tra kết nối internet!"
          );
        } else {
          toast.error(error.response.data);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendOtp = async () => {
    if (isResendEnabled) {
      try {
        setIsLoading(true);
        const message = await resendOtp(identifier);
        toast.success(message);

        // Clear các trường OTP
        setOtpArray(Array(6).fill("")); // Reset OTP inputs
        inputRefs.current[0]?.focus(); // Đặt con trỏ vào ô đầu tiên

        // Đặt lại countdown và vô hiệu hóa nút gửi lại OTP
        setCountdown(60);
        setIsResendEnabled(false);
      } catch (error) {
        toast.error("Không thể gửi lại OTP, vui lòng thử lại!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleCloseModal} centered size="md">
        <Modal.Header closeButton className="border-0">
          <i
            className="bi bi-chevron-left"
            style={{ cursor: "pointer", fontSize: "1.5rem" }}
            onClick={handleBack}
          ></i>
          <Modal.Title className="w-100 text-center">Xác thực OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-lg-12 mx-auto p-2 py-5 p-sm-3">
            <p className="opacity-75">
              Vui lòng nhập mã OTP được gửi đến email của bạn để tiếp tục quá
              trình xác thực.
            </p>
            <h3 className="mb-4 text-center text-uppercase fw-bold">
              Nhập mã OTP
            </h3>
            <div
              className="d-flex justify-content-center mb-3"
              onPaste={handlePasteOtp}
            >
              {otpArray.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  className={`form-control text-center mx-1 ${
                    errors.otp ? "is-invalid" : ""
                  }`}
                  style={{ width: "40px" }}
                  value={digit}
                  onChange={(e) => handleChangeOtp(index, e.target.value)}
                />
              ))}
            </div>
            {errors.otp && (
              <div
                className="invalid-feedback text-center"
                style={{ display: "block" }}
              >
                {errors.otp}
              </div>
            )}
            <button
              type="button"
              className={`btn w-100 py-2 fw-bold text-white mb-2 ${styles.verifyButton}`}
              onClick={() => handleVerifyOtp()}
              disabled={isLoading}
            >
              Xác thực
            </button>
            <div className="text-center mt-3">
              {isResendEnabled ? (
                <button
                  className="btn btn-link p-0 text-primary fw-bold"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                >
                  Gửi lại mã OTP
                </button>
              ) : (
                <span className="text-muted">
                  Gửi lại mã sau {countdown} giây
                </span>
              )}
            </div>
            <p className="text-center mt-3">
              <span className={styles.loginLink} onClick={handleShowLoginModal}>
                Quay lại đăng nhập
              </span>
            </p>
          </div>
        </Modal.Body>
      </Modal>
      {isLoading && (
        <div className="d-flex vh-100 position-fixed top-0 start-0 end-0 justify-content-center align-items-center wrapper-loading">
          <Spinner animation="border" variant="primary"></Spinner>
        </div>
      )}
    </>
  );
}

export default VerifyOtpModal;
