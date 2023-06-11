import React from "react";
import { Outlet } from "react-router-dom";
import Header, { HeaderProps } from "../components/Header.jsx";

const Layout: React.FC<HeaderProps> = ({
  username,
  currentPage,
  theme,
  toggleThemeFunc,
}) => {
  return (
    <div className={theme}>
      <Header
        username={username}
        currentPage={currentPage}
        theme={theme}
        toggleThemeFunc={toggleThemeFunc}
      />
      <hr />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
