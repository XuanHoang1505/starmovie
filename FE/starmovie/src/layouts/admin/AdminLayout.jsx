import React from "react";
import {
  AppContent,
  AppSidebar,
  AppHeader,
  AppFooter,
} from "../../components/admin";
import GlobalStyles from "../../assets/admin/scss/GlobalStyles/GlobalStyles";

const AdminLayout = () => {
  return (
    <GlobalStyles>
      <AppSidebar />
      <div className="light_background wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </GlobalStyles>
  );
};

export default AdminLayout;
