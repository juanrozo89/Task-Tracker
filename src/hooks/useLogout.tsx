import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../Contexts";

import axios from "axios";

const useLogout = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext)!;

  axios
    .post("/api/log-out", { username: `${user ? user.username : ""}` })
    .then((res) => {
      console.log(`${res.data.result}`);
      setUser(null);
      navigate("/");
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
