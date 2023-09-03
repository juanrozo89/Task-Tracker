import { useNavigate } from "react-router-dom";
import { useContext, useRef } from "react";
import { UserContext, PopupContext, IsLoadingContext } from "../Contexts";

import { PASSWORD_LIMIT } from "../constants";

import DOMPurify from "dompurify";
import { handleErrorAlert, handleSuccessAlert } from "../utils/alertFunctions";
import useAxiosInstance from "../hooks/useAxiosInstance";
import useUserSession from "../hooks/useUserSession";

const ResetPassword = () => {
  const { setIsLoading } = useContext(IsLoadingContext)!;
  const { user, setUser } = useUserSession();

  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();

  const { setPopup } = useContext(PopupContext)!;

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

  return (
    <>
      {user ? (
        <section id="reset-password" className="content">
          <h2>{user.username}</h2>
          <h2>Reset your password</h2>
          <form
            id="reset-password-form"
            className="left-aligned-form"
            onSubmit={updatePassword}
          >
            <label htmlFor="reset-new-password">New password: </label>
            <input
              type="password"
              name="new_password"
              id="reset-new-password"
              autoComplete="new-password"
              ref={newPasswordRef}
              maxLength={PASSWORD_LIMIT}
              required
            />
            <label htmlFor="reset-confirm-password">
              Confirm new password:{" "}
            </label>
            <div>
              <input
                type="password"
                name="confirm_new_password"
                id="reset-confirm-password"
                ref={confirmPasswordRef}
                maxLength={PASSWORD_LIMIT}
                required
              />
            </div>
            <button type="submit">Confirm</button>
          </form>
        </section>
      ) : (
        <section id="reset-password" className="content">
          <h2>No valid user nor token</h2>
        </section>
      )}
    </>
  );
};

export default ResetPassword;
