import { useState, useEffect } from "react";

import useAxiosInstance from "../hooks/useAxiosInstance";
import { handleAxiosError } from "../utils/alertFunctions";

const useUserSession = (
  setHasInternalError: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const [user, setUser] = useState<User | null>(null);
  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axiosInstance.get("/api/user-from-session");
        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (error: any) {
        if (error.response?.data?.error) {
          const errorMessage = error.response.data.error;
          setHasInternalError(errorMessage);
        } else {
          setHasInternalError("An unexpected error occurred");
        }
        handleAxiosError(error);
      }
    };
    getUserData();
  }, []);

  return { user, setUser };
};

export default useUserSession;
