import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header, { HeaderProps } from "../components/Header";
import { ThemeContext } from "../Contexts";

const Layout: React.FC<HeaderProps> = ({ username, currentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useContext(ThemeContext)!;

  useEffect(() => {
    navigate(location.pathname);
  }, [theme]);

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
