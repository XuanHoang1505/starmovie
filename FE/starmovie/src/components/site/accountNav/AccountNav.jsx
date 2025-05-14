import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { openModal } from "../../../redux/slices/authModalSlice";
import { UserContext } from "../../../contexts/UserContext";
import TippyWrapper from "../common/tippyWrapper/TippyWrapper";
import defaultAvatar from "../../../assets/admin/images/avatars/user.png";
import styles from "./AccountNav.module.scss";
import { logout } from "../../../services/site/AuthService";

import { NavLink } from "react-router-dom";
const AccountNav = () => {
  const dispatch = useDispatch();
  const { user, updateUser } = useContext(UserContext);
  const handleLogout = async () => {
    logout(user.userId);
    updateUser(null);
  };
  const renderContent = () => (
    <div className={`${styles.wrapper}`}>
      {!user ? (
        <div className="d-flex flex-column align-items-center justify-content-center">
          <p className={styles.text_suggest}>
            Đăng nhập để theo dõi các nội dung mới nhất
          </p>
          <Button
            onClick={() => dispatch(openModal("showLoginSelectionModal"))}
            className={`w75 border-0 ${styles.btn_login}`}
          >
            Đăng Nhập
          </Button>
        </div>
      ) : (
        <ul className="d-flex flex-column ">
          <div as={NavLink} to="/" className={styles.user_image}>
            <img
              src={user.avatar || defaultAvatar}
              alt="avatar"
              size="md"
              className="object-fit-cover rounded-circle "
              style={{ width: "50px", height: "50px", marginRight: "15px" }}
            />
            <p className="">{user.fullName}</p>
          </div>
          <li as={NavLink} to="/">
            <i className="bi bi-bookmark-plus"></i>
            <span>Yêu thích của tôi</span>
            <i className="bi bi-chevron-right ps-2"></i>
          </li>
          <li as={NavLink} to="/">
            <i className="bi bi-alarm"></i>
            <span>Phim đặt trước</span>
            <i className="bi bi-chevron-right ps-2"></i>
          </li>
          <li as={NavLink} to="/profile">
            <i className="bi bi-person"></i>
            <span>Thông tin cá nhân</span>
            <i className="bi bi-chevron-right ps-2"></i>
          </li>
          <li onClick={handleLogout}>
            <i className="bi bi-box-arrow-left"></i>
            <span>Đăng xuất</span>
            <i className="bi bi-chevron-right ps-2"></i>
          </li>
        </ul>
      )}
    </div>
  );
  return (
    <TippyWrapper renderContent={renderContent}>
      <div className={styles.nav_content}>
        {!user ? (
          <>
            <i className="bi bi-person-circle fs-5"></i>
            <span className={`${styles.nav_title}`}>Của tôi</span>
          </>
        ) : (
          <img
            src={user.avatar || defaultAvatar}
            alt="avatar"
            size="md"
            className={`object-fit-cover rounded-circle  ${styles.avatar_responsive}`}
            style={{
              width: "25px",
              height: "25px",
              border: "1px solid rgba(255, 255, 255, 0.25)",
            }}
          />
        )}
      </div>
    </TippyWrapper>
  );
};
export default AccountNav;
