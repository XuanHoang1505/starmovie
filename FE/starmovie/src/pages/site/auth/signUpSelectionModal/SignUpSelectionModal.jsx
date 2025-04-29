import React from "react";
import { Modal, Button } from "react-bootstrap";
import iconFB from "../../../../assets/site/images/icons/facebook.png";
import iconGG from "../../../../assets/site/images/icons/google.png";
import styles from "./SignUpSelectionModal.module.scss";

const SignUpSelectionModal = ({
  show,
  handleClose,
  handleShowSignUpModal,
  handleShowLoginModal,
}) => {
  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="md">
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className="w-100 text-center">Đăng ký</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`text-center ${styles.modalBody}`}>
          <p className={styles.description}>
            Tạo tài khoản của bạn, có thể lưu lại lịch sử xem và mục yêu thích
            trên nhiều thiết bị.
          </p>

          <div className="d-grid gap-2">
            <Button
              variant="light"
              className={styles.signUpButton}
              onClick={handleShowSignUpModal}
            >
              <i className={`bi bi-envelope ${styles.icon}`}></i> Sử dụng Email
              để Đăng ký
            </Button>

            <Button variant="light" className={styles.signUpButton}>
              <img
                src={iconGG}
                width={25}
                alt="Google"
                className={styles.icon}
              />{" "}
              Sử dụng Google để Đăng ký
            </Button>
            <Button variant="light" className={styles.signUpButton}>
              <img
                src={iconFB}
                width={25}
                alt="Facebook"
                className={styles.icon}
              />{" "}
              Sử dụng Facebook để Đăng ký
            </Button>
          </div>

          <p className="mt-4" style={{ fontWeight: "500" }}>
            Bạn đã có tài khoản?{" "}
            <span className={styles.signUpLink} onClick={handleShowLoginModal}>
              Đăng nhập
            </span>
          </p>

          <p className="m-2 text-muted" style={{ fontSize: "0.8rem" }}>
            Nhấn chọn " Đăng ký " có nghĩa là bạn đã đọc và đồng ý{" "}
            <a href="#" className="text-mute">
              Thỏa thuận quyền riêng tư
            </a>{" "}
            & <a href="#">Điều khoản dịch vụ</a>, đồng thời có nghĩa là bạn xác
            nhận đã tròn 18 tuổi có thể sử dụng dịch vụ của chúng tôi
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SignUpSelectionModal;
