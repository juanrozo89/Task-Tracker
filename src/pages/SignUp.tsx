import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext, PopupContext } from "../Contexts";

import axios from "axios";
import DOMPurify from "dompurify";
import { handleErrorAlert } from "../utils/alertFunctions";

const SignUp = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const { setUser } = useContext(UserContext)!;
  const { setPopup } = useContext(PopupContext)!;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .post("/api/sign-up", {
        username: username,
        password: password,
        confirm_password: confirmPassword,
      })
      .then((res) => {
        console.log(`${res.data.result}`);
        setUser(res.data.user);
        navigate("/");
      })
      .catch((error) => {
        handleErrorAlert(error, setPopup);
      });
  };

  return (
    <section id="sign-up" className="content">
      <h2>Register a new account:</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="signup-username">Username: </label>
        <input
          type="text"
          name="username"
          id="signup-username"
          onChange={(e) => setUsername(DOMPurify.sanitize(e.target.value))}
          required
        />

        <label htmlFor="signup-password">Password: </label>
        <input
          type="password"
          name="password"
          id="signup-password"
          onChange={(e) => setPassword(DOMPurify.sanitize(e.target.value))}
          autoComplete="new-password"
          required
        />

        <label htmlFor="signup-confirm-password">Confirm password: </label>
        <input
          type="password"
          name="confirm_password"
          id="confirm-password-signup"
          onChange={(e) =>
            setConfirmPassword(DOMPurify.sanitize(e.target.value))
          }
          autoComplete="new-password"
          required
        />

        <button type="submit">Sign Up!</button>
      </form>
    </section>
  );
};

export default SignUp;
