import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Header, { HeaderProps } from "../components/Header";
import { ThemeContext } from "../Contexts";

const Layout: React.FC<HeaderProps> = ({ username, pageTitle }) => {
  const { theme } = useContext(ThemeContext)!;

  return (
    <div className={theme}>
      <Header username={username} pageTitle={pageTitle} />
      <hr />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
