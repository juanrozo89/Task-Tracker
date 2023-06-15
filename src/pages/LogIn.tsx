import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../Contexts";

import axios from "axios";
import useAxiosError from "../hooks/useAxiosError";

const LogIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { setUser } = useContext(UserContext)!;

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
        useAxiosError(error);
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
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="login-password">Password: </label>
        <input
          type="password"
          name="password"
          id="login-password"
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <button type="submit">Log In</button>
      </form>
    </section>
  );
};

export default LogIn;
