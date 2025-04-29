import { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";

import { sendOtp } from "../../../../services/site/AuthService";
import styles from "./ForgotPasswordModal.module.scss";

function ForgotPasswordModal({
  show,
  handleClose,
  handleBack,
  handleShowVerifyOtpModal,
  handleForgotPassword,
}) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email không đúng định dạng.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async () => {
    if (validateEmail()) {
      try {
        const type = "FORGOT_PASSWORD";
        setIsLoading(true);
        // Gửi otp
        const message = await sendOtp(email, type);
        toast.success(message);

        handleForgotPassword({ identifier: email, type });
        handleShowVerifyOtpModal();
      } catch (error) {
        console.error("Lỗi handleSendOTP:", error);
        if (error.response && error.response.data) {
          toast.error(error.response.data); // ⚡ lấy nội dung từ API trả về
        } else if (error.message) {
          toast.error(error.message); // ví dụ lỗi mạng
        } else {
          toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setEmail("");
    setErrors({});
    handleClose();
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
          <Modal.Title className="w-100 text-center">Quên mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="opacity-75">
            Đừng lo, hãy nhập email của bạn để đặt lại mật khẩu. Chúng tôi sẽ
            hướng dẫn bạn các bước tiếp theo.
          </p>
          <div className="col-lg-12 mx-auto p-2 py-5 p-sm-3">
            <div className="mb-3">
              <label htmlFor="emailField" className="form-label my-1">
                Email
              </label>
              <input
                type="text"
                id="emailField"
                placeholder="Nhập vào email của bạn"
                className={`form-control py-2 ${
                  errors.email ? "is-invalid" : ""
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="invalid-feedback">{errors.email || ""}</div>
            </div>
            <button
              type="button"
              className={`btn w-100 py-2 fw-bold text-white mb-2 ${styles.sendOtpButton}`}
              onClick={handleSendOtp}
            >
              Gửi mã OTP
            </button>

            <p className="text-center mt-3">
              <span className={styles.loginLink} onClick={handleBack}>
                Quay lại đăng nhập
              </span>
            </p>
          </div>
        </Modal.Body>
      </Modal>
      {isLoading && (
        <div className="d-flex vh-100 position-fixed top-0 start-0 end-0 justify-content-center align-items-center wrapper-loading">
          <Spinner animation="border" variant="primary" className=""></Spinner>
        </div>
      )}
    </>
  );
}

export default ForgotPasswordModal;
