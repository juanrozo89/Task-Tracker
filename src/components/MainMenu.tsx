import useDisplayMenu from "../hooks/useDisplayMenu";
import { Link } from "react-router-dom";
import { LIGHT, DARK } from "../constants.js";
import { useContext } from "react";
import { ThemeContext } from "../Contexts";

const MainMenu = () => {
  let { displayMenu, setDisplayMenu, menuRef } = useDisplayMenu();
  const { theme, toggleTheme } = useContext(ThemeContext)!;
  const toggleThemeFunc = () => {
    toggleTheme();
  };

  return (
    <div id="main-menu" ref={menuRef}>
      <div
        id="main-menu-button"
        onClick={() => {
          setDisplayMenu(!displayMenu);
        }}
      >
        ≡
      </div>
      {displayMenu && (
        <ul id="main-menu-list" className="menu-list">
          <li>
            <Link to="/about" id="menu-home" className="menu-slot">
              About
            </Link>
          </li>
          <li>
            <Link
              to="https://github.com/juanrozo89"
              id="menu-github"
              className="menu-slot"
              target="_blank"
            >
              Github Repo&nbsp;&nbsp;&nbsp;↗
            </Link>
          </li>
          <li>
            <Link to="/" target="_blank" id="menu-donate" className="menu-slot">
              Make a Donation&nbsp;&nbsp;&nbsp;↗
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
