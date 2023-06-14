import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../Contexts";

import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const { setUser } = useContext(UserContext)!;

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
        console.log(error.toJSON());
        /*
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          //console.log(error.response.status);
          //console.log(error.response.headers);
          setResponse(`${error.response.data.error}`);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);*/
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
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="signup-password">Password: </label>
        <input
          type="password"
          name="password"
          id="signup-password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="signup-confirm-password">Confirm password: </label>
        <input
          type="password"
          name="confirm_password"
          id="confirm-password-signup"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit">Sign Up!</button>
      </form>
    </section>
  );
};

export default SignUp;
