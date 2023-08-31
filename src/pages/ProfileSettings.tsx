import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext, PopupContext, IsLoadingContext } from "../Contexts";
import RedirectToLogin from "../components/RedirectToLogin";
import { CONFIRM } from "../constants";

import { USERNAME_LIMIT, PASSWORD_LIMIT } from "../constants";

import DOMPurify from "dompurify";
import { handleErrorAlert, handleSuccessAlert } from "../utils/alertFunctions";
import useAxiosInstance from "../hooks/useAxiosInstance";

const ProfileSettings = () => {
  const { user, setUser } = useContext(UserContext)!;
  const { setPopup, setOnConfirm } = useContext(PopupContext)!;
  const { setIsLoading } = useContext(IsLoadingContext)!;

  const navigate = useNavigate();

  const axiosInstance = useAxiosInstance();

  const newUsernameRef = useRef<HTMLInputElement>(null);
  const newEmailRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const updateUsername = () => {
    const request = () => {
      setIsLoading(true);
      axiosInstance
        .put("/api/update-info", {
          new_username: DOMPurify.sanitize(newUsernameRef.current!.value),
          new_email: "",
          new_password: "",
          confirm_password: "",
        })
        .then((res) => {
          handleSuccessAlert(res, setPopup);
          setUser((prevUser) => ({
            ...prevUser!,
            username: res.data.new_username,
          }));
          newUsernameRef.current!.value = "";
        })
        .catch((error) => {
          handleErrorAlert(error, setPopup);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    return request;
  };

  const confirmUpdateUsername = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPopup({
      type: CONFIRM,
      title: "Confirm",
      content: `Are you sure you want to change your username from '${
        user!.username
      }' to '${newUsernameRef.current!.value}'?`,
    });
    setOnConfirm(updateUsername);
  };

  const updateEmail = () => {
    const request = () => {
      setIsLoading(true);
      axiosInstance
        .put("/api/update-info", {
          new_username: "",
          new_email: DOMPurify.sanitize(newEmailRef.current!.value),
          new_password: "",
          confirm_password: "",
        })
        .then((res) => {
          handleSuccessAlert(res, setPopup);
          setUser((prevUser) => ({
            ...prevUser!,
            username: res.data.new_username,
          }));
          newEmailRef.current!.value = "";
        })
        .catch((error) => {
          handleErrorAlert(error, setPopup);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    return request;
  };

  const confirmUpdateEmail = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPopup({
      type: CONFIRM,
      title: "Confirm",
      content: `Are you sure you want to change your e-mail from '${
        user!.email
      }' to '${newEmailRef.current!.value}'?`,
    });
    setOnConfirm(updateEmail);
  };

  const updatePassword = () => {
    const request = () => {
      setIsLoading(true);
      axiosInstance
        .put("/api/update-info", {
          new_username: "",
          new_email: "",
          new_password: DOMPurify.sanitize(newPasswordRef.current!.value),
          confirm_password: DOMPurify.sanitize(
            confirmPasswordRef.current!.value
          ),
        })
        .then((res) => {
          handleSuccessAlert(res, setPopup);
          setUser((prevUser) => ({
            ...prevUser!,
            password: res.data.new_password,
          }));
          newPasswordRef.current!.value = "";
          confirmPasswordRef.current!.value = "";
        })
        .catch((error) => {
          handleErrorAlert(error, setPopup);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    return request;
  };

  const confirmUpdatePassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPopup({
      type: CONFIRM,
      title: "Confirm",
      content: "Are you sure you want to change your password?",
    });
    setOnConfirm(updatePassword);
  };

  const deleteAccount = () => {
    const request = () => {
      setIsLoading(true);
      axiosInstance
        .delete("/api/delete-account")
        .then((res) => {
          handleSuccessAlert(res, setPopup);
          setUser(null);
          newUsernameRef.current!.value = "";
          newPasswordRef.current!.value = "";
          confirmPasswordRef.current!.value = "";
          navigate("/");
        })
        .catch((error) => {
          handleErrorAlert(error, setPopup);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    return request;
  };

  const confirmDeleteAccount = (_: React.MouseEvent<HTMLElement>) => {
    setPopup({
      type: CONFIRM,
      title: "Confirm",
      content:
        'Are you sure you want to <span class="alert-text"><b>delete</b></span> your account?<br>This is a permanent action and all your information will be lost',
    });

    setOnConfirm(deleteAccount);
  };

  let content;
  if (!user) {
    content = <RedirectToLogin />;
  } else {
    content = (
      <section id="profile-settings" className="content">
        <h2>Update your info</h2>
        {/*  CHANGE USERNAME  */}
        <div id="username-in-profile" className="profile-info">
          <div className="profile-info-subtitle">
            Current username:&nbsp;&nbsp;
          </div>
          <div className="profile-info-content">{user.username}</div>
        </div>
        <form
          id="change-username-form"
          className="left-aligned-form"
          onSubmit={confirmUpdateUsername}
        >
          <label htmlFor="update-new-username">New username: </label>
          <div>
            <input
              type="text"
              name="new_username"
              id="update-new-username"
              ref={newUsernameRef}
              maxLength={USERNAME_LIMIT}
              required
            />
            <button type="submit" className="inline-button">
              Apply
            </button>
          </div>
        </form>

        {/*  CHANGE EMAIL  */}
        <div id="email-in-profile" className="profile-info">
          <div className="profile-info-subtitle">
            Current e-mail:&nbsp;&nbsp;
          </div>
          <div className="profile-info-content">{user.email}</div>
        </div>
        <form
          id="change-email-form"
          className="left-aligned-form"
          onSubmit={confirmUpdateEmail}
        >
          <label htmlFor="update-new-email">Update e-mail: </label>
          <div>
            <input
              type="email"
              name="new_email"
              id="update-new-email"
              ref={newEmailRef}
              required
            />
            <button type="submit" className="inline-button">
              Apply
            </button>
          </div>
        </form>

        {/*  CHANGE PASSWORD  */}
        <form
          id="change-password-form"
          className="left-aligned-form"
          onSubmit={confirmUpdatePassword}
        >
          <label htmlFor="update-new-password">New password: </label>
          <input
            type="password"
            name="new_password"
            id="update-new-password"
            autoComplete="new-password"
            ref={newPasswordRef}
            maxLength={PASSWORD_LIMIT}
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
              ref={confirmPasswordRef}
              maxLength={PASSWORD_LIMIT}
              required
            />
            <button type="submit" className="inline-button">
              Apply
            </button>
          </div>
        </form>

        {/*  DELETE ACCOUNT  */}
        <button id="delete-account-button" onClick={confirmDeleteAccount}>
          Delete account
        </button>
      </section>
    );
  }
  return <div id="profile-settings">{content}</div>;
};

export default ProfileSettings;
