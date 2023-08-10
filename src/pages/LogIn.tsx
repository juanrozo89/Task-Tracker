import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext, PopupContext } from "../Contexts";

import axios from "axios";
import DOMPurify from "dompurify";
import { handleErrorAlert } from "../utils/alertFunctions";

const LogIn = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const { setUser } = useContext(UserContext)!;
  const { setPopup } = useContext(PopupContext)!;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .post("/api/log-in", {
        username: username,
        password: password,
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
    <section id="log-in" className="content">
      <h2>Log in to your account:</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="login-username">Username: </label>
        <input
          type="text"
          name="username"
          id="login-username"
          onChange={(e) => setUsername(DOMPurify.sanitize(e.target.value))}
          required
        />

        <label htmlFor="login-password">Password: </label>
        <input
          type="password"
          name="password"
          id="login-password"
          onChange={(e) => setPassword(DOMPurify.sanitize(e.target.value))}
          autoComplete="new-password"
          required
        />

        <button type="submit">Log In</button>
      </form>
    </section>
  );
};

export default LogIn;
