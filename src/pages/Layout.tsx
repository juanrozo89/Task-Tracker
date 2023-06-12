import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header, { HeaderProps } from "../components/Header.jsx";
import { ThemeContext } from "../Contexts";

const Layout: React.FC<HeaderProps> = ({ username, currentPage }) => {
  const { theme } = useContext(ThemeContext)!;
  return (
    <div className={theme}>
      <Header username={username} currentPage={currentPage} />
      <hr />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
