import MainMenu from "./MainMenu";
//import ProfileMenu from "./ProfileMenu";
import { MAIN, PROFILE_SETTINGS } from "../constants";

const Header: React.FC<HeaderProps> = ({ username, pageTitle }) => {
  return (
    <div id="header-container">
      <header>
        <MainMenu username={username} />
        <h1
          id="main-title"
          className={
            pageTitle == MAIN
              ? "long-title"
              : pageTitle == PROFILE_SETTINGS
              ? "longest-title"
              : ""
          }
        >
          {pageTitle}
        </h1>
        {/*<ProfileMenu username={username} />*/}
        <div id="header-background"></div>
      </header>
      <hr id="header-hr" />
    </div>
  );
};

export default Header;
