import MainMenu from "./MainMenu";
import ProfileMenu from "./ProfileMenu";

const Header: React.FC<HeaderProps> = ({ username, pageTitle }) => {
  return (
    <>
      <header>
        <MainMenu />
        <h1 id="main-title">{pageTitle}</h1>
        <ProfileMenu username={username} />
        <div id="header-background"></div>
      </header>
    </>
  );
};

export default Header;
