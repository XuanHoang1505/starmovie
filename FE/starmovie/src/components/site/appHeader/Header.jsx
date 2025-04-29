import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Tippy from "@tippyjs/react/headless";
import { Button, Dropdown } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { UserContext } from "../../../contexts/UserContext";
import { logout } from "../../../services/site/AuthService";
import defaultAvatar from "../../../assets/admin/images/avatars/user.png";
import {
  openModal,
  closeModal,
  setOtpInfo,
  resetAllModals,
} from "../../../redux/slices/authModalSlice";
import TippyWrapper from "../common/tippyWrapper/TippyWrapper";

import LoginSelectionModal from "../../../pages/site/auth/loginSelectionModal/LoginSelectionModal";
import LoginModal from "../../../pages/site/auth/loginModal/LoginModal";
import SignUpSelectionModal from "../../../pages/site/auth/signUpSelectionModal/SignUpSelectionModal";
import SignUpModal from "../../../pages/site/auth/signUpModal/SignUpModal";
import VerifyOtpModal from "../../../pages/site/auth/verifyOtpModal/VerifyOtpModal";
import ForgotPasswordModal from "../../../pages/site/auth/forgotPasswordModal/ForgotPasswordModal";
import ResetPasswordModal from "../../../pages/site/auth/resetPasswordModal/ResetPasswordModal";

import styles from "./Header.module.scss";
import CategoryMenu from "../categoryMenu/CategoryMenu";

function Header() {
  const dispatch = useDispatch();
  const {
    showLoginSelectionModal,
    showLoginModal,
    showSignUpSelectionModal,
    showSignUpModal,
    showVerifyOtpModal,
    showForgotPasswordModal,
    showResetPasswordModal,
    otpInfo,
  } = useSelector((state) => state.authModal);
  const [iconUp, setIconUp] = useState(false);
  const { user, updateUser } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      dispatch(resetAllModals());
    }
  }, [user, dispatch]);

  const handleLogout = async () => {
    logout(user.userId);
    updateUser(null);
  };

  const handleSignUpSuccess = (info) => {
    dispatch(setOtpInfo(info));
    dispatch(closeModal("showSignUpModal"));
    dispatch(openModal("showVerifyOtpModal"));
  };

  const handleForgotPassword = (info) => {
    dispatch(setOtpInfo(info));
    dispatch(closeModal("showForgotPasswordModal"));
    dispatch(openModal("showVerifyOtpModal"));
  };
  const categories = ["Phim Bộ", "Phim Hàn", "Phim Lẻ", "Hoạt hình"];
  return (
    <>
      <div className={styles.headerContainer}>
        <div className={`navbar-expand-lg ${styles.navbar}`}>
          {/* <button className={`bg-transparent d-md-none `}><i className="bi bi-list fs-3 text-light"></i></button> */}
          <Link to="/" className={`navbar-brand p-0 ${styles.brand}`}>
            <h2 className={styles.brand}>StarMovie</h2>
          </Link>
          <div className={`text-light px-4 ${styles.left_header}`}>
            <NavLink
              to="/ABC"
              className={`nav-item nav-link me-3 ${styles.nav_item}`}
            >
              Hoài Thủy Trúc Đình
            </NavLink>
            <NavLink
              to="/"
              className={`nav-item nav-link me-3 ${styles.nav_item}`}
            >
              Đề xuất
            </NavLink>
            <CategoryMenu
              onHover={() => {
                setIconUp(!iconUp);
              }}
              categories={categories}
              className="me-3"
            >
              Khác{" "}
              {iconUp ? (
                <i className={`bi bi-caret-down-fill fs-6`}></i>
              ) : (
                <i className={`bi bi-caret-up-fill fs-6`}></i>
              )}
            </CategoryMenu>
          </div>

          {!user ? (
            <Button
              onClick={() => dispatch(openModal("showLoginSelectionModal"))}
              className="btn btn-primary rounded-pill py-2 px-4"
            >
              Đăng Nhập
            </Button>
          ) : (
            <Dropdown align="start" className="ms-lg-4">
              <Dropdown.Toggle
                id="dropdown-basic"
                className="border-0 px-0 px-lg-2"
                bsPrefix="custom-toggle"
                style={{ background: "none" }}
              >
                <img
                  src={user?.avatar || defaultAvatar}
                  alt="User"
                  className={styles.avatar}
                  width={50}
                  height={50}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu className="m-0 mt-3">
                <Dropdown.Item as={NavLink} to="/my-profile">
                  Thông tin cá nhân
                </Dropdown.Item>
                {user.role !== "USER" && (
                  <Dropdown.Item as={NavLink} to="/admin">
                    Chuyển sang quản lý
                  </Dropdown.Item>
                )}
                <Dropdown.Item as={NavLink} to="/settings">
                  Cài đặt
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
      {/* Modal */}
      <LoginSelectionModal
        show={showLoginSelectionModal}
        handleClose={() => dispatch(closeModal("showLoginSelectionModal"))}
        handleShowLoginModal={() => {
          dispatch(closeModal("showLoginSelectionModal"));
          dispatch(openModal("showLoginModal"));
        }}
        handleShowSignUpModal={() => {
          dispatch(closeModal("showLoginSelectionModal"));
          dispatch(openModal("showSignUpSelectionModal"));
        }}
      />
      <SignUpSelectionModal
        show={showSignUpSelectionModal}
        handleClose={() => dispatch(closeModal("showSignUpSelectionModal"))}
        handleShowSignUpModal={() => {
          dispatch(closeModal("showSignUpSelectionModal"));
          dispatch(openModal("showSignUpModal"));
        }}
        handleShowLoginModal={() => {
          dispatch(closeModal("showSignUpSelectionModal"));
          dispatch(openModal("showLoginSelectionModal"));
        }}
      />
      <LoginModal
        show={showLoginModal}
        handleClose={() => dispatch(closeModal("showLoginModal"))}
        handleBack={() => {
          dispatch(closeModal("showLoginModal"));
          dispatch(openModal("showLoginSelectionModal"));
        }}
        handleShowSignUpModal={() => {
          dispatch(closeModal("showLoginModal"));
          dispatch(openModal("showSignUpSelectionModal"));
        }}
        handleShowForgotPasswordModal={() => {
          dispatch(closeModal("showLoginModal"));
          dispatch(openModal("showForgotPasswordModal"));
        }}
      />
      <SignUpModal
        show={showSignUpModal}
        handleClose={() => dispatch(closeModal("showSignUpModal"))}
        handleBack={() => {
          dispatch(closeModal("showSignUpModal"));
          dispatch(openModal("showSignUpSelectionModal"));
        }}
        handleShowLoginModal={() => {
          dispatch(closeModal("showSignUpModal"));
          dispatch(openModal("showLoginSelectionModal"));
        }}
        handleShowVerifyOtpModal={() => {
          dispatch(closeModal("showSignUpModal"));
          dispatch(openModal("showVerifyOtpModal"));
        }}
        handleSignUpSuccess={handleSignUpSuccess}
      />
      <VerifyOtpModal
        show={showVerifyOtpModal}
        otpInfo={otpInfo}
        handleCloseModal={() => dispatch(closeModal("showVerifyOtpModal"))}
        handleBack={() => {
          dispatch(closeModal("showVerifyOtpModal"));
          dispatch(openModal("showSignUpModal"));
        }}
        handleShowLoginModal={() => {
          dispatch(closeModal("showVerifyOtpModal"));
          dispatch(openModal("showLoginModal"));
        }}
        handleShowResetPasswordModal={() => {
          dispatch(closeModal("showVerifyOtpModal"));
          dispatch(openModal("showResetPasswordModal"));
        }}
      />
      <ForgotPasswordModal
        show={showForgotPasswordModal}
        handleClose={() => dispatch(closeModal("showForgotPasswordModal"))}
        handleBack={() => {
          dispatch(closeModal("showForgotPasswordModal"));
          dispatch(openModal("showLoginModal"));
        }}
        handleShowVerifyOtpModal={() => {
          dispatch(closeModal("showForgotPasswordModal"));
          dispatch(openModal("showVerifyOtpModal"));
        }}
        handleForgotPassword={handleForgotPassword}
      />
      <ResetPasswordModal
        show={showResetPasswordModal}
        otpInfo={otpInfo}
        handleClose={() => dispatch(closeModal("showResetPasswordModal"))}
        handleBack={() => {
          dispatch(closeModal("showResetPasswordModal"));
          dispatch(openModal("showVerifyOtpModal"));
        }}
        handleShowLoginModal={() => {
          dispatch(closeModal("showResetPasswordModal"));
          dispatch(openModal("showLoginModal"));
        }}
      />
    </>
  );
}

export default Header;
