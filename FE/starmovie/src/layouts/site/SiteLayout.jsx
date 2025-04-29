import React from "react";
import Header from "../../components/site/appHeader/Header";
import Content from "../../components/site/appContent/Content";
import GlobalStyle from "../../assets/site/scss/GlobalStyles";
const SiteLayout = () => {
  return (
    <GlobalStyle>
      <Header />
      <Content />
    </GlobalStyle>
  );
};

export default SiteLayout;
