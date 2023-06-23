import { useState, useEffect } from "react";

import axios from "axios";
import { handleAxiosError } from "../utils/alertFunctions";

const useUserSession = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get("/api/user-from-session");
        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        axios.isAxiosError(error)
          ? handleAxiosError(error)
          : console.log("Error: " + error);
      }
    };
    getUserData();
  }, []);

  return { user, setUser };
};

export default useUserSession;
