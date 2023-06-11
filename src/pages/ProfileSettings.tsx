import RedirectToLogin from "../components/RedirectToLogin";

const ProfileSettings: React.FC<{ user: any }> = ({ user }) => {
  let content;
  if (!user) {
    content = <RedirectToLogin />;
  } else {
    content = (
      <form action="" method="post">
        <label>
          Change username:{" "}
          <input type="text" name="username" id="username-input" required />
        </label>

        <label>
          Password:{" "}
          <input type="text" name="password" id="password-input" required />
        </label>

        <button type="submit">Log In</button>
      </form>
    );
  }
  return <div id="profile-settings">{content}</div>;
};

export default ProfileSettings;
