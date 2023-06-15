import { useState, useContext } from "react";
import { UserContext } from "../Contexts";
import RedirectToLogin from "../components/RedirectToLogin";

import axios from "axios";

const ProfileSettings: React.FC<{ user: any }> = ({ user }) => {
  const { setUser } = useContext(UserContext)!;
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateUsername = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .put("/api/update-info", {
        username: user.username,
        new_username: newUsername,
        new_password: "",
        confirm_password: "",
      })
      .then((res) => {
        console.log(`${res.data.result}`);
        setUser((prevUser) => ({
          ...prevUser!,
          username: res.data.new_username,
        }));
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error: ", error.message);
        }
      });
  };

  const updatePassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .put("/api/update-info", {
        username: user.username,
        new_username: "",
        new_password: newPassword,
        confirm_password: confirmPassword,
      })
      .then((res) => {
        console.log(`${res.data.result}`);
        setUser((prevUser) => ({
          ...prevUser!,
          password: res.data.new_password,
        }));
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error: ", error.message);
        }
      });
  };

  let content;
  if (!user) {
    content = <RedirectToLogin />;
  } else {
    content = (
      <section id="profile-settings" className="content">
        <h2>Update your info</h2>
        <div id="profile-settings-forms">
          <form
            id="change-username-form"
            className="left-aligned-form"
            onSubmit={updateUsername}
          >
            <label htmlFor="update-new-username">Change username: </label>
            <div>
              <input
                type="text"
                name="new_username"
                id="update-new-username"
                onChange={(e) => setNewUsername(e.target.value)}
                required
              />
              <button type="submit" className="inline-button">
                Apply
              </button>
            </div>
          </form>
          <form
            id="change-password-form"
            className="left-aligned-form"
            onSubmit={updatePassword}
          >
            <label htmlFor="update-new-password">Change password: </label>
            <input
              type="password"
              name="new_password"
              id="update-new-password"
              autoComplete="new-password"
              onChange={(e) => setNewPassword(e.target.value)}
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
                onChange={(e) => setConfirmPassword(e.target.value)}
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
