import React, { Suspense, useEffect } from "react";

import { useSelector } from "react-redux";

import { UserProvider } from "./contexts/UserContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import AdminLayout from "./layouts/admin/AdminLayout";
import SiteLayout from "./layouts/site/SiteLayout";
import { CSpinner, useColorModes } from "@coreui/react";
import "./scss/style.scss";

import "./scss/examples.scss";
import PrivateRoute from "./utils/PrivateRoute";
import LoginPage from "./pages/site/auth/LoginPage";
import SignUpPage from "./pages/site/auth/SignUpPage";

function App() {
  const { isColorModeSet, setColorMode } = useColorModes(
    "coreui-free-react-admin-template-theme"
  ); // để quản lý chế độ màu (color mode) của giao diện người dùng
  const storedTheme = useSelector((state) => state.theme);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split("?")[1]);
    const theme =
      urlParams.get("theme") &&
      urlParams.get("theme").match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    }

    if (isColorModeSet()) {
      return;
    }

    setColorMode(storedTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Router>
        <UserProvider>
          <Suspense
            fallback={
              <div className="pt-3 text-center">
                <CSpinner color="primary" variant="grow" />
              </div>
            }
          >
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<SignUpPage />} />

              <Route
                path="/admin/*"
                element={
                  <PrivateRoute roles={["ADMIN"]}>
                    <AdminLayout />
                  </PrivateRoute>
                }
              />

              {/* <Route path="/*" element={<SiteLayout />} /> */}

              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </UserProvider>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default App;
