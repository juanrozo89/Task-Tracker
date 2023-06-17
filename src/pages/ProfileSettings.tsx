import { useState, useContext, useRef } from "react";
import { UserContext, PopupContext } from "../Contexts";
import RedirectToLogin from "../components/RedirectToLogin";
import { CONFIRM } from "../constants";

import axios from "axios";
import useAxiosError from "../hooks/useAxiosError";

const ProfileSettings = () => {
  const { user, setUser } = useContext(UserContext)!;
  const { setPopup, setOnConfirm } = useContext(PopupContext)!;

  const [newUsername, setNewUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const updateUsername = () => {
    const request = () => {
      axios
        .put("/api/update-info", {
          username: user!.username,
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
          usernameRef.current!.value = "";
        })
        .catch((error) => {
          useAxiosError(error);
        });
    };
    return request;
  };

  const confirmUpdateUsername = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPopup({
      type: CONFIRM,
      title: "Confirm",
      message: `Are you sure you want to change your username from '${
        user!.username
      }' to '${newUsername}'?`,
    });

    setOnConfirm(updateUsername);
  };

  const updatePassword = () => {
    const request = () => {
      axios
        .put("/api/update-info", {
          username: user!.username,
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
          passwordRef.current!.value = "";
          confirmPasswordRef.current!.value = "";
        })
        .catch((error) => {
          useAxiosError(error);
        });
    };
    return request;
  };

  const confirmUpdatePassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPopup({
      type: CONFIRM,
      title: "Confirm",
      message: "Are you sure you want to change your password?",
    });

    setOnConfirm(updatePassword);
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
            onSubmit={confirmUpdateUsername}
          >
            <label htmlFor="update-new-username">Change username: </label>
            <div>
              <input
                type="text"
                name="new_username"
                id="update-new-username"
                onChange={(e) => setNewUsername(e.target.value)}
                ref={usernameRef}
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
            onSubmit={confirmUpdatePassword}
          >
            <label htmlFor="update-new-password">Change password: </label>
            <input
              type="password"
              name="new_password"
              id="update-new-password"
              autoComplete="new-password"
              onChange={(e) => setNewPassword(e.target.value)}
              ref={passwordRef}
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
                ref={confirmPasswordRef}
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
