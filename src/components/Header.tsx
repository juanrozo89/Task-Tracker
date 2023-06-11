import MainMenu from "./MainMenu";
import ProfileMenu from "./ProfileMenu";
import { Theme } from "../constants.js";

export interface HeaderProps {
  username: string;
  currentPage: string;
  theme: Theme;
  toggleThemeFunc: () => void;
}

const Header: React.FC<HeaderProps> = ({
  username,
  currentPage,
  theme,
  toggleThemeFunc,
}) => {
  return (
    <>
      <header>
        <MainMenu theme={theme} toggleThemeFunc={toggleThemeFunc} />
        <h1 id="main-title">{currentPage}</h1>
        <ProfileMenu username={username} />
        <div id="header-background"></div>
      </header>
    </>
  );
};

export default Header;
