import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import { resetPassword } from "../../../../services/site/AuthService"; // Thêm service cho reset mật khẩu
import styles from "./ResetPasswordModal.module.scss";

function ResetPasswordModal({
  show,
  handleClose,
  handleShowLoginModal,
  handleBack,
  otpInfo,
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const email = otpInfo?.identifier;

  useEffect(() => {
    // Kiểm tra nếu không có identifier, chuyển hướng về trang login
    if (show && !email) {
      toast.error("Truy cập không hợp lệ, vui lòng thử lại!");
      handleShowLoginModal();
    }
  }, [email, show]);

  const validatePassword = () => {
    const newErrors = {};
    if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (validatePassword()) {
      try {
        setIsLoading(true);
        const message = await resetPassword(email, password);
        toast.success(message);
        handleShowLoginModal();
      } catch (error) {
        toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleCloseModal = () => {
    handleClose();
    setPassword("");
    setErrors({});
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
          <Modal.Title className="w-100 text-center">
            Đặt lại mật khẩu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="opacity-75">
            Nhập mật khẩu mới của bạn để hoàn tất quá trình đặt lại mật khẩu.
          </p>
          <div className="col-12 mx-auto p-4 py-5 p-sm-3">
            <div className="mb-1">
              <label htmlFor="passwordField" className="form-label my-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                id="passwordField"
                placeholder="Nhập mật khẩu mới"
                className={`form-control py-2 ${
                  errors.password ? "is-invalid" : ""
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="invalid-feedback">{errors.password || ""}</div>
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPasswordField" className="form-label my-1">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                id="confirmPasswordField"
                placeholder="Nhập lại mật khẩu"
                className={`form-control py-2 ${
                  errors.confirmPassword ? "is-invalid" : ""
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="invalid-feedback">
                {errors.confirmPassword || ""}
              </div>
            </div>
            <button
              type="button"
              className={`btn w-100 py-2 fw-bold text-white mb-2 mt-3 ${styles.resetButton}`}
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              Đặt lại mật khẩu
            </button>
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

export default ResetPasswordModal;
