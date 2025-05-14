import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { UserContext } from "../../../contexts/UserContext";
import {
  openModal,
  closeModal,
  setOtpInfo,
  resetAllModals,
} from "../../../redux/slices/authModalSlice";

import useDebounce from "../../../hooks/useDebounce";

import Search from "../search/Search";
import LoginSelectionModal from "../../../pages/site/auth/loginSelectionModal/LoginSelectionModal";
import LoginModal from "../../../pages/site/auth/loginModal/LoginModal";
import SignUpSelectionModal from "../../../pages/site/auth/signUpSelectionModal/SignUpSelectionModal";
import SignUpModal from "../../../pages/site/auth/signUpModal/SignUpModal";
import VerifyOtpModal from "../../../pages/site/auth/verifyOtpModal/VerifyOtpModal";
import ForgotPasswordModal from "../../../pages/site/auth/forgotPasswordModal/ForgotPasswordModal";
import ResetPasswordModal from "../../../pages/site/auth/resetPasswordModal/ResetPasswordModal";

import styles from "./Header.module.scss";
import CategoryMenu from "../categoryMenu/CategoryMenu";
import WatchHistoryNav from "../watchHistoryNav/WatchHistoryNav";
import LanguageNav from "../languageNav/LanguageNav";
import AccountNav from "../accountNav/AccountNav";
import VipNav from "../vipNav/VipNav";

function Header() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const debouncedWidth = useDebounce(windowWidth, 100);
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
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      dispatch(resetAllModals());
    }
  }, [user, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
  const fakeWatchHistories = [
    {
      movieTitle: "Vô Ưu Độ",
      poster:
        "https://th.bing.com/th/id/OIP.2UKgeVT8qv_rNjXRtsCcuAHaE8?w=233&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      episodeTitle: "tập 12",
    },
    {
      movieTitle: "One Piece",
      poster:
        "https://th.bing.com/th/id/OIP.WFJ_ja7xHwNxhAgDPVuk6AHaDt?w=344&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      episodeTitle: "tập 992",
    },
    {
      movieTitle: "Ninh Anh Như Mộng",
      poster:
        "https://th.bing.com/th/id/OIP.Xo8yDYPZ8h69WQsH0fRBqQHaEp?w=284&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
      episodeTitle: "tập 1",
    },
  ];
  const languages = ["Việt Nam", "English"];
  return (
    <>
      <div className={styles.headerContainer}>
        <div className={`navbar-expand-lg ${styles.navbar}`}>
          {/* <button className={`bg-transparent d-md-none `}><i className="bi bi-list fs-3 text-light"></i></button> */}
          <Link to="/" className={`navbar-brand p-0 ${styles.brand}`}>
            <h2 className={styles.brand}>StarMovie</h2>
          </Link>
          <div className={styles.navContent}>
            <div className={`text-light px-4 ${styles.left_header}`}>
              <NavLink
                to="/ABC"
                className={`nav-item nav-link me-3 d-none d-xl-block ${styles.nav_item}`}
              >
                Hoài Thủy Trúc Đình
              </NavLink>
              <NavLink
                to="/"
                className={`nav-item nav-link me-3 d-none d-xl-block ${styles.nav_item}`}
              >
                Đề xuất
              </NavLink>
              <CategoryMenu
                onHover={() => {
                  setIconUp(!iconUp);
                }}
                categories={categories}
                className={`${styles.nav_item}`}
              >
                <NavLink className="d-none d-xl-block text-decoration-none text-light">
                  Khác
                  {iconUp ? (
                    <i
                      className={`bi bi-caret-down-fill`}
                      style={{ fontSize: "10px", marginLeft: "2px" }}
                    ></i>
                  ) : (
                    <i
                      className={`bi bi-caret-up-fill`}
                      style={{ fontSize: "10px", marginLeft: "2px" }}
                    ></i>
                  )}
                </NavLink>
              </CategoryMenu>
              <CategoryMenu
                width={debouncedWidth}
                onHover={() => {
                  setIconUp(!iconUp);
                }}
                categories={categories}
                className={`${styles.nav_item} `}
              >
                <NavLink className="d-xl-none d-block  text-decoration-none text-light">
                  Lướt xem
                  {iconUp ? (
                    <i
                      className={`bi bi-caret-down-fill`}
                      style={{ fontSize: "10px", marginLeft: "2px" }}
                    ></i>
                  ) : (
                    <i
                      className={`bi bi-caret-up-fill`}
                      style={{ fontSize: "10px", marginLeft: "2px" }}
                    ></i>
                  )}
                </NavLink>
              </CategoryMenu>
            </div>
            <div className={`${styles.right_header}`}>
              <Search />
              <WatchHistoryNav
                watchHistories={fakeWatchHistories}
                hasUser={!!user}
              />
              <LanguageNav languages={languages} />
              <AccountNav />
              <VipNav />
            </div>
          </div>
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
