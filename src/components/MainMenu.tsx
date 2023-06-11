import useDisplayMenu from "../hooks/useDisplayMenu";
import { Link } from "react-router-dom";
import { LIGHT, DARK, Theme } from "../constants.js";

interface MainMenuProps {
  toggleThemeFunc: () => void;
  theme: Theme;
}

const MainMenu: React.FC<MainMenuProps> = ({ toggleThemeFunc, theme }) => {
  let { displayMenu, setDisplayMenu, menuRef } = useDisplayMenu();

  const toggleTheme = () => {
    toggleThemeFunc();
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
              onClick={toggleTheme}
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
