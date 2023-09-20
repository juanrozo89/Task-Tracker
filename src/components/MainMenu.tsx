import { Link } from "react-router-dom";
import { DARK } from "../constants.js";
import { useContext } from "react";
import { ThemeContext } from "../Contexts";
import useDisplayMenu from "../hooks/useDisplayMenu";
import useLogout from "../hooks/useLogout";

const MainMenu: React.FC<{ username: string }> = ({ username }) => {
  let { displayMenu, setDisplayMenu, menuRef } = useDisplayMenu();
  const logoutUser = useLogout();
  const { theme, toggleTheme } = useContext(ThemeContext)!;
  const toggleThemeFunc = () => {
    toggleTheme();
  };

  return (
    <div id="main-menu" ref={menuRef}>
      <div
        id="main-menu-btn"
        onClick={() => {
          setDisplayMenu(!displayMenu);
        }}
      >
        ≡
      </div>
      {displayMenu && (
        <ul
          id="main-menu-list"
          className="menu-list"
          onClick={() => {
            setDisplayMenu(false);
          }}
        >
          {username ? (
            <>
              <li>
                <Link to="/" id="profile-tasks" className="menu-slot">
                  My Tasks
                </Link>
              </li>
              <li>
                <Link
                  to="/profile-settings"
                  id="profile-settings"
                  className="menu-slot"
                >
                  Profile settings
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  id="logout"
                  className="menu-slot"
                  onClick={logoutUser!}
                >
                  Log out
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/" id="profile-login" className="menu-slot">
                  Log In
                </Link>
              </li>
              <li>
                <Link to="/sign-up" id="profile-signup" className="menu-slot">
                  Sign Up
                </Link>
              </li>
            </>
          )}
          <hr id="menu-hr" />
          <li>
            <Link to="/about" id="menu-home" className="menu-slot">
              About
            </Link>
          </li>
          <li>
            <Link
              to="https://github.com/juanrozo89/Task-Tracker"
              id="menu-github"
              className="menu-slot"
              target="_blank"
            >
              Github Repo&nbsp;&nbsp;&nbsp;↗
            </Link>
          </li>
          <li>
            <Link
              to=""
              id="change-theme"
              className="menu-slot"
              onClick={toggleThemeFunc}
            >
              {theme == DARK ? "Change to light theme" : "Change to dark theme"}
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default MainMenu;
