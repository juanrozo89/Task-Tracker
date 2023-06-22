import { useState, useEffect } from "react";

import axios from "axios";
import useAxiosError from "../hooks/useAxiosError";

const useUserSession = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get("/api/user-from-session");
        setUser(response.data.user);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          useAxiosError(error);
          if (error.response?.status === 401) {
            setUser(null);
          }
        } else {
          console.log("Error: " + error);
        }
      }
    };
    getUserData();
  }, []);

  return { user, setUser };
};

export default useUserSession;
