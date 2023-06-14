import { Link } from "react-router-dom";
import useDisplayMenu from "../hooks/useDisplayMenu";
import useLogout from "../hooks/useLogout";

const ProfileMenu: React.FC<{ username: string }> = ({ username }) => {
  let { displayMenu, setDisplayMenu, menuRef } = useDisplayMenu();
  let menuContent;

  const logoutUser = useLogout();

  if (username) {
    menuContent = (
      <ul id="profile-menu-list" className="menu-list">
        <li>
          <Link to="/" id="profile-add-task" className="menu-slot">
            Add task
          </Link>
        </li>
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
          <Link to="/" id="logout" className="menu-slot" onClick={logoutUser!}>
            Log out
          </Link>
        </li>
      </ul>
    );
  } else {
    menuContent = (
      <ul id="profile-menu-list" className="menu-list">
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
      </ul>
    );
  }
  return (
    <div id="profile-menu" className="menu" ref={menuRef}>
      <div
        id="profile-menu-button"
        onClick={() => {
          setDisplayMenu(!displayMenu);
        }}
      >
        {username ? ":)" : ":/"}
      </div>
      {displayMenu && menuContent}
    </div>
  );
};

export default ProfileMenu;
