import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header, { HeaderProps } from "../components/Header";
import { ThemeContext } from "../Contexts";

const Layout: React.FC<HeaderProps> = ({ username, pageTitle }) => {
  const { theme } = useContext(ThemeContext)!;

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    navigate(location.pathname);
  }, [theme]);

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
