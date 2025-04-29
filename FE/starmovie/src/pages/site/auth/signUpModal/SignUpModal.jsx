import { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { sendOtp } from "../../../../services/site/AuthService";
import { Spinner } from "react-bootstrap";
import styles from "./SignUpModal.module.scss";

function SignUpModal({
  show,
  handleClose,
  handleBack,
  handleShowLoginModal,
  handleSignUpSuccess,
  handleShowVerifyOtpModal,
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName) {
      newErrors.fullName = "Vui lòng nhập họ và tên.";
    }

    if (!email) {
      newErrors.email = "Vui lòng nhập email.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Email không đúng định dạng.";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu cần ít nhất 6 ký tự.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (validate()) {
      try {
        const type = "REGISTER";
        setIsLoading(true);
        const userData = {
          fullName: fullName,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        };
        // Gửi otp
        const message = await sendOtp(email, type);
        toast.success(message);

        handleSignUpSuccess({ identifier: email, userData, type });
        handleShowVerifyOtpModal();
      } catch (error) {
        if (error.response && error.response.data) {
          toast.error(error.response.data);
        } else if (error.message) {
          toast.error(error.message); // ví dụ: Network Error, Connection Refused
        } else {
          toast.error("Đã xảy ra lỗi vui lòng thử lại sau!");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
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
            Đăng ký bằng tài khoản
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <form>
            <div className="mb-1">
              <label htmlFor="fullNameField" className="form-label my-1">
                Họ và tên
              </label>
              <input
                type="text"
                id="fullNameField"
                placeholder="Nhập họ và tên"
                className={`form-control py-2 ${
                  errors.fullName ? "is-invalid" : ""
                }`}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <div className="invalid-feedback">{errors.fullName || ""}</div>
            </div>
            <div className="row">
              <div className="col-md-12 mb-1">
                <label htmlFor="emailField" className="form-label my-1">
                  Email
                </label>
                <input
                  type="email"
                  id="emailField"
                  placeholder="Nhập vào email"
                  className={`form-control py-2 ${
                    errors.email ? "is-invalid" : ""
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="invalid-feedback">{errors.email || ""}</div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-1">
                <label htmlFor="passwordField" className="form-label my-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  id="passwordField"
                  placeholder="Mật khẩu"
                  className={`form-control py-2 ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="invalid-feedback">{errors.password || ""}</div>
              </div>
              <div className="col-md-6 mb-1">
                <label
                  htmlFor="confirmPasswordField"
                  className="form-label my-1"
                >
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  id="confirmPasswordField"
                  placeholder="Xác nhận mật khẩu"
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
            </div>
            <button
              type="button"
              className={`btn w-100 py-2 fw-bold text-white mb-2 mt-3 ${styles.signUpButton}`}
              style={{ background: "#2D5A8E" }}
              onClick={handleSignUp}
            >
              {isLoading ? (
                <Spinner
                  animation="border"
                  variant="primary"
                  className=""
                ></Spinner>
              ) : (
                "Đăng ký"
              )}
            </button>
            <div className="text-center mt-4">
              <p className="mt-3">
                Đã có tài khoản?{" "}
                <span
                  className={styles.signUpLink}
                  onClick={handleShowLoginModal}
                >
                  Đăng nhập
                </span>
              </p>
              <p className="m-2 text-muted" style={{ fontSize: "0.8rem" }}>
                Nhấn chọn " Đăng ký " có nghĩa là bạn đã đọc và đồng ý{" "}
                <a href="#" className="text-mute">
                  Thỏa thuận quyền riêng tư
                </a>{" "}
                & <a href="#">Điều khoản dịch vụ</a>, đồng thời có nghĩa là bạn
                xác nhận đã tròn 18 tuổi có thể sử dụng dịch vụ của chúng tôi
              </p>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default SignUpModal;
