import { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Modal } from "react-bootstrap";

import { login } from "../../../../services/site/AuthService";
import { UserContext } from "../../../../contexts/UserContext";
import { Spinner } from "react-bootstrap";
import styles from "./LoginModal.module.scss";

function LoginModal({
  show,
  handleClose,
  handleBack,
  handleShowSignUpModal,
  handleShowForgotPasswordModal,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useContext(UserContext); // Lấy hàm cập nhật user từ context
  const [isLoading, setIsLoading] = useState(false);

  // useCallback giúp đảm bảo handleNavigate sẽ không thay đổi giữa các lần render trừ khi navigate thay đổi.
  const handleNavigate = useCallback(
    (role) => {
      const rolePaths = {
        ADMIN: "/admin/home",
        // EMPLOYEE: "/employee/dashboard",
        // TRAINER: "/trainer/dashboard",
        USER: "/",
      };
      navigate(rolePaths[role] || "/");
    },
    [navigate]
  );

  useEffect(() => {
    // Kiểm tra nếu người dùng đã đăng nhập rồi thì điều hướng trở lại trang chủ theo vai trò.
    if (user) {
      handleNavigate(user.role);
    }
  }, [user, handleNavigate]);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username) {
      newErrors.username = "Vui lòng nhập email.";
    } else if (!emailRegex.test(username)) {
      newErrors.username = "Email không đúng định dạng.";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu cần ít nhất 6 ký tự.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (validate()) {
      try {
        setIsLoading(true);
        const data = await login(username, password);
        console.log(data);
        const userDetail = {
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          avatar: data.avatar,
          role: data.role,
        };
        // lưu nó vào context để context lưu vào localStorage và sử dụng chung cho toàn bộ ứng dụng
        updateUser(userDetail);

        handleNavigate(userDetail.role); // chuyển hướng theo vai trò
        handleCloseModal(); // Đóng modal sau khi đăng nhập thành công
      } catch (error) {
        if (error.response) {
          const responseData = error.response.data;
          if (typeof responseData === "string") {
            toast.error(responseData); // Vì API trả về là string
          } else if (responseData?.message) {
            toast.error(responseData.message); // Nếu sau này API trả về dạng { message: "..." }
          } else {
            toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
          }
        } else if (error.message) {
          toast.error(error.message);
        } else {
          toast.error("Đã xảy ra lỗi, vui lòng thử lại sau!");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    handleClose();
    setUsername("");
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
            Đăng nhập bằng tài khoản
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <form onSubmit={handleLogin}>
            {errors.form && (
              <div className="alert alert-danger py-2" role="alert">
                {errors.form}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="usernameField" className="form-label my-1">
                Email
              </label>
              <input
                type="text"
                id="usernameField"
                placeholder="Nhập vào số Email của bạn"
                className={`form-control py-2 ${
                  errors.username ? "is-invalid" : ""
                }`}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className="invalid-feedback">{errors.username || ""}</div>
            </div>
            <div className="mb-3 position-relative">
              <label htmlFor="passwordField" className="form-label my-1">
                Mật khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="passwordField"
                placeholder="Nhập vào mật khẩu của bạn"
                className={`form-control py-2 pe-5 ${
                  errors.password ? "is-invalid" : ""
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="invalid-feedback">{errors.password || ""}</div>

              <button
                type="button"
                className={styles.eyeButton} // dùng class từ scss
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="bi bi-eye-slash fs-5"></i>
                ) : (
                  <i className="bi bi-eye fs-5"></i>
                )}
              </button>
            </div>
            <div className="row mb-3">
              <div className="col d-flex ms-1">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label ms-2">Nhớ mật khẩu</label>
              </div>
              <div className="col text-end p-0 me-3">
                <p
                  className={styles.forgotPasswordLink}
                  onClick={handleShowForgotPasswordModal}
                >
                  Quên mật khẩu?
                </p>
              </div>
            </div>
            <button
              type="submit"
              className={`btn w-100 py-2 fw-bold text-white mb-2 ${styles.loginButton}`}
            >
              {isLoading ? (
                <Spinner size="sm" animation="border" />
              ) : (
                "Đăng nhập"
              )}
            </button>
            <div className="text-center mt-4">
              <p className="mt-3">
                Bạn chưa có tài khoản?{" "}
                <span
                  className={`${styles.signUpLink}`}
                  onClick={handleShowSignUpModal}
                >
                  Đăng ký
                </span>
              </p>
            </div>
            <p className="m-2 text-muted" style={{ fontSize: "0.8rem" }}>
              Nhấn chọn " Đăng nhập " có nghĩa là bạn đã đọc và đồng ý{" "}
              <a href="#" className="text-mute">
                Thỏa thuận quyền riêng tư
              </a>{" "}
              & <a href="#">Điều khoản dịch vụ</a>, đồng thời có nghĩa là bạn
              xác nhận đã tròn 18 tuổi có thể sử dụng dịch vụ của chúng tôi
            </p>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default LoginModal;
