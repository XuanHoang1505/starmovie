import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import GlobalStylesAdmin from "./assets/admin/scss/GlobalStyles";
import GlobalStylesSite from "./assets/admin/scss/GlobalStyles";
import AdminLayout from "./layouts/admin/AdminLayout";
import SiteLayout from "./layouts/site/SiteLayout";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <GlobalStylesAdmin>
        <AdminLayout></AdminLayout>
      </GlobalStylesAdmin>
      <GlobalStylesSite>
        <SiteLayout></SiteLayout>
      </GlobalStylesSite>
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
