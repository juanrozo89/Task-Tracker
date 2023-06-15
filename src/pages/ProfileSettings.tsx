import RedirectToLogin from "../components/RedirectToLogin";

const ProfileSettings: React.FC<{ user: any }> = ({ user }) => {
  let content;
  if (!user) {
    content = <RedirectToLogin />;
  } else {
    content = (
      <section id="profile-settings" className="content">
        <h2>Update your info</h2>
        <div id="profile-settings-forms">
          <form id="change-username-form" className="left-aligned-form">
            <label htmlFor="update-new-username">Change username: </label>
            <div>
              <input
                type="text"
                name="new_username"
                id="update-new-username"
                required
              />
              <button type="submit" className="inline-button">
                Apply
              </button>
            </div>
          </form>
          <form id="change-password-form" className="left-aligned-form">
            <label htmlFor="update-new-password">Change password: </label>
            <input
              type="password"
              name="new_password"
              id="update-new-password"
              autoComplete="new-password"
              required
            />
            <label htmlFor="update-confirm-password">
              Confirm new password:{" "}
            </label>
            <div>
              <input
                type="password"
                name="confirm_new_password"
                id="update-confirm-password"
                required
              />
              <button type="submit" className="inline-button">
                Apply
              </button>
            </div>
          </form>
          <button id="delete-account-button">Delete account</button>
        </div>
      </section>
    );
  }
  return <div id="profile-settings">{content}</div>;
};

export default ProfileSettings;
