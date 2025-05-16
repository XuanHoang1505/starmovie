import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Offcanvas from "react-bootstrap/Offcanvas";
import Accordion from "react-bootstrap/Accordion";
import { useSelector, useDispatch } from "react-redux";
import { UserContext } from "../../../contexts/UserContext";
import {
  openModal,
  closeModal,
  setOtpInfo,
  resetAllModals,
} from "../../../redux/slices/authModalSlice";

import useDebounce from "../../../hooks/useDebounce";
import defaultAvatar from "../../../assets/admin/images/avatars/user.png";
import { logout } from "../../../services/site/AuthService";

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
  const [showMenu, setShowMenu] = useState(false);

  const handleCloseMenu = () => setShowMenu(false);
  const handleShowMenu = () => setShowMenu(true);

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
  const { user, updateUser } = useContext(UserContext);

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
  const handleLogout = async () => {
    logout(user.userId);
    updateUser(null);
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
      <div className={`d-none d-md-block ${styles.headerContainer}`}>
        <div className={`navbar-expand-lg ${styles.navbar}`}>
          {/* <button className={`bg-transparent d-md-none `}><i className="bi bi-list fs-3 text-light"></i></button> */}
          <Link to="/" className={`navbar-brand p-0 mb-1 ${styles.brand}`}>
            <h2 className={styles.brand}>StarMovie</h2>
          </Link>
          <div className={styles.navContent}>
            <div className={`text-light ms-1 ms-lg-4 ${styles.left_header}`}>
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
                <NavLink
                  className={
                    "d-xl-none d-block  text-decoration-none text-light"
                  }
                >
                  Thêm
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
      <div className={`d-block d-md-none p-1 ${styles.mobile_header}`}>
        <div
          className={`d-flex justify-content-around align-items-center gap-2 mx-2 ${styles.mobile_header_content}`}
        >
          <i
            className="bi bi-list fs-3 text-light"
            onClick={handleShowMenu}
          ></i>
          <Link
            to="/"
            className={`navbar-brand mb-0 ${styles.brand}`}
            style={{ color: "var(--primary)" }}
          >
            <h4 className={`${styles.brand} mb-0`}>StarMovie</h4>
          </Link>
          <Search sizeWidth={`${100}%`} sizeHeight={`${30}px`} />
          <button
            className="px-2 py-1 text-light d-flex align-items-center gap-1 small rounded-1"
            style={{ backgroundColor: "var(--text-color)" }}
          >
            <i className="bi bi-box-arrow-down"></i>
            APP
          </button>
        </div>
        <div
          className={`d-flex align-items-center gap-4 px-3 py-3 ${styles.mobile_header_nav}`}
        >
          <NavLink
            to={"/hoaithuytrucdinh"}
            className={`text-decoration-none fw-semibold text-nowrap ${styles.nav_mobile_item}`}
          >
            Hoài Thủy Trúc Đình
          </NavLink>
          <NavLink
            to={`/`}
            className={`text-decoration-none fw-semibold text-nowrap ${styles.nav_mobile_item}`}
          >
            Đề xuất
          </NavLink>
          {categories.map((item, index) => (
            <NavLink
              to={`/${item}`}
              key={index}
              className={`text-decoration-none fw-semibold text-nowrap ${styles.nav_mobile_item}`}
            >
              {item}
            </NavLink>
          ))}
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
      <Offcanvas
        show={showMenu}
        onHide={handleCloseMenu}
        style={{ width: "270px" }}
        className="d-block d-md-none"
      >
        <Offcanvas.Header className="p-0">
          {user ? (
            <div className={`${styles.user_image} d-flex align-items-center`}>
              <img
                src={user.avatar || defaultAvatar}
                alt="avatar"
                className="object-fit-cover rounded-circle border border-1 border-secondary-subtle"
                style={{
                  minWidth: "45px",
                  maxHeight: "45px",
                  marginRight: "15px",
                }}
              />
              <p className="m-0 text-truncate flex-grow-1">{user.fullName}</p>
            </div>
          ) : (
            <div
              className={`${styles.user_image} d-flex align-items-center`}
              onClick={() => {
                setShowMenu(false);
                dispatch(openModal("showLoginSelectionModal"));
              }}
            >
              <img
                src={defaultAvatar}
                alt="avatar"
                className="object-fit-cover rounded-circle border border-1 border-secondary-subtle"
                style={{
                  minWidth: "45px",
                  maxHeight: "45px",
                  marginRight: "15px",
                }}
              />
              <p className="m-0 text-truncate flex-grow-1">
                Đăng nhập / Đăng ký
              </p>
            </div>
          )}
        </Offcanvas.Header>
        <Offcanvas.Body className={`${styles.offcanvas_body}`}>
          <div className="d-flex flex-column gap-2">
            <button className={`mb-1 ${styles.vip_button}`}>
              {" "}
              Gia nhập VIP
            </button>
            <NavLink
              to={"/account"}
              className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
            >
              Cài đặt cá nhân
            </NavLink>
            <NavLink
              to={"/"}
              className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
            >
              Tiếng Việt
            </NavLink>
            <hr className="my-2 border-secondary" />
            <NavLink
              to={"/watch-history"}
              className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none pb-2`}
            >
              Lịch sử xem
            </NavLink>
            <NavLink
              to={"/favorite"}
              className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
            >
              Yêu thích của tôi
            </NavLink>
            <NavLink
              to={"/sub-title"}
              className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
            >
              Bản dịch phụ đề
            </NavLink>
            <NavLink
              to={"/review"}
              className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
            >
              Đánh giá của tôi
            </NavLink>
            <hr className="my-2 border-secondary" />
            <Accordion>
              <Accordion.Item
                eventKey="0"
                style={{ backgroundColor: "transparent" }}
              >
                <Accordion.Header>Giới thiệu về chúng tôi</Accordion.Header>
                <Accordion.Body className="p border-0">
                  <div className="d-flex flex-column gap-2">
                    <NavLink
                      to={"/review"}
                      className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
                    >
                      Thông tin công ty
                    </NavLink>
                    <NavLink
                      to={"/review"}
                      className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
                    >
                      Giới thiệu dịch vụ
                    </NavLink>
                    <NavLink
                      to={"/review"}
                      className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
                    >
                      Cách xem
                    </NavLink>
                    <NavLink
                      to={"/review"}
                      className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
                    >
                      Quan hệ nhà đầu tư
                    </NavLink>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item
                eventKey="1"
                style={{ backgroundColor: "transparent" }}
              >
                <Accordion.Header>Hợp tác</Accordion.Header>
                <Accordion.Body>
                  <div className="d-flex flex-column gap-2">
                    <NavLink
                      to={"/review"}
                      className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
                    >
                      Đăng quảng cáo
                    </NavLink>
                    <NavLink
                      to={"/review"}
                      className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
                    >
                      Quan hệ kinh doanh
                    </NavLink>
                    <NavLink
                      to={"/review"}
                      className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
                    >
                      Hợp tác cài đặt trước
                    </NavLink>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item
                eventKey="2"
                style={{ backgroundColor: "transparent" }}
              >
                <Accordion.Header>Hỗ trợ và giúp đỡ</Accordion.Header>
                <Accordion.Body>
                  <div className="d-flex flex-column gap-2">
                    <NavLink
                      to={"/review"}
                      className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
                    >
                      Phản ánh ý kiến
                    </NavLink>
                    <NavLink
                      to={"/review"}
                      className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
                    >
                      Trung tâm phản hồi bảo mật
                    </NavLink>
                    <NavLink
                      to={"/review"}
                      className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
                    >
                      Câu hỏi thường gặp
                    </NavLink>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item
                eventKey="3"
                style={{ backgroundColor: "transparent" }}
              >
                <Accordion.Header>Điều khoản dịch vụ</Accordion.Header>
                <Accordion.Body>
                  <div className="d-flex flex-column gap-2">
                    <NavLink
                      to={"/review"}
                      className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
                    >
                      Điều khoản dịch vụ
                    </NavLink>
                    <NavLink
                      to={"/review"}
                      className={`${styles.nav_item_sideBar} w-100 text-light text-decoration-none py-2`}
                    >
                      Điều khoản sử dụng
                    </NavLink>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            {user && (
              <button
                className={`my-2 ${styles.logout_button}`}
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Header;
