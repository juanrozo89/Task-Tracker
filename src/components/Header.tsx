import MainMenu from "./MainMenu";
import ProfileMenu from "./ProfileMenu";
import { Theme } from "../constants.js";

export interface HeaderProps {
  username: string;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ username, currentPage }) => {
  return (
    <>
      <header>
        <MainMenu />
        <h1 id="main-title">{currentPage}</h1>
        <ProfileMenu username={username} />
        <div id="header-background"></div>
      </header>
    </>
  );
};

export default Header;
