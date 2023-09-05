import { useNavigate } from "react-router-dom";
import { useContext, useRef } from "react";
import { UserContext, PopupContext, IsLoadingContext } from "../Contexts";
import { ALERT, USERNAME_LIMIT } from "../constants";

import DOMPurify from "dompurify";
import { handleErrorAlert } from "../utils/alertFunctions";
import useAxiosInstance from "../hooks/useAxiosInstance";

import PasswordInput from "../components/PasswordInput";

const LogIn = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { setIsLoading } = useContext(IsLoadingContext)!;

  const navigate = useNavigate();

  const axiosInstance = useAxiosInstance();

  const { setUser } = useContext(UserContext)!;
  const { setPopup } = useContext(PopupContext)!;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    axiosInstance
      .post("/api/log-in", {
        username: DOMPurify.sanitize(usernameRef.current!.value),
        password: DOMPurify.sanitize(passwordRef.current!.value),
      })
      .then((res) => {
        console.log(`${res.data.result}`);
        setUser(res.data.user);
        navigate("/");
      })
      .catch((error) => {
        handleErrorAlert(error, setPopup);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const recoverPassword = () => {
    if (usernameRef.current?.value === "") {
      usernameRef.current.focus();
    } else {
      setIsLoading(true);
      axiosInstance
        .post("/api/recover-password", {
          username: DOMPurify.sanitize(usernameRef.current!.value),
        })
        .then((res) => {
          //console.log(`${res.data.result}`);
          setPopup({
            type: ALERT,
            title: "E-mail Sent",
            content: res.data.result,
          });
          navigate("/");
        })
        .catch((error) => {
          handleErrorAlert(error, setPopup);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <section id="log-in" className="content">
      <h2>Log in to your account:</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="login-username">Username: </label>
        <input
          type="text"
          id="login-username"
          ref={usernameRef}
          maxLength={USERNAME_LIMIT}
          required
        />

        <label htmlFor="login-password">Password: </label>
        <PasswordInput id={"login-password"} ref={passwordRef} />
        <p
          id="recover-password-link"
          className="link"
          onClick={recoverPassword}
        >
          I forgot my password
        </p>
        <button type="submit">Log In</button>
      </form>
    </section>
  );
};

export default LogIn;
