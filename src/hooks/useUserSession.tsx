import { useState, useEffect } from "react";

import useAxiosInstance from "../hooks/useAxiosInstance";
import { handleAxiosError } from "../utils/alertFunctions";

const useUserSession = () => {
  const [user, setUser] = useState<User | null>(null);
  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axiosInstance.get("/api/user-from-session");
        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        handleAxiosError(error);
      }
    };
    getUserData();
  }, []);

  return { user, setUser };
};

export default useUserSession;
