import RedirectToLogin from "../components/RedirectToLogin";

const ProfileSettings: React.FC<{ user: any }> = ({ user }) => {
  let content;
  if (!user) {
    content = <RedirectToLogin />;
  } else {
    content = (
      <section id="profile-settings" className="content">
        <h2>Update your info</h2>
        <div>
          <form id="change-username-form" className="left-aligned-form">
            <label htmlFor="username-input">Change username: </label>
            <div>
              <input type="text" name="username" id="username-input" required />
              <button type="submit" className="inline-button">
                Apply
              </button>
            </div>
          </form>
          <form id="change-password-form" className="left-aligned-form">
            <label htmlFor="password-input">Change password: </label>
            <input
              type="password"
              name="password"
              id="password-input"
              required
            />
            <label htmlFor="confirm-password-input">
              Confirm new password:{" "}
            </label>
            <div>
              <input
                type="password"
                name="confirm_password"
                id="confirm-password-input"
                required
              />
              <button type="submit" className="inline-button">
                Apply
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }
  return <div id="profile-settings">{content}</div>;
};

export default ProfileSettings;
