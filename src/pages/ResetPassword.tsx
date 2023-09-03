import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext, IsLoadingContext } from "../Contexts";

import useAxiosInstance from "../hooks/useAxiosInstance";

const ResetPassword = () => {
  const { setIsLoading } = useContext(IsLoadingContext)!;
  const { setUser } = useContext(UserContext)!;
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const _id = queryParams.get("_id");

  const axiosInstance = useAxiosInstance();

  const [failedRequest, setFailedRequest] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    console.log("Token:", token);
    console.log("_id:", _id);
    axiosInstance
      .get(`/api/reset-password?token=${token}&_id=${_id}`)
      .then((res) => {
        setUser(res.data.user);
        navigate("/profile-settings");
      })
      .catch((error) => {
        console.error("Error:", error);
        setFailedRequest(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div id="reset-password-fail" className="content">
      {failedRequest && (
        <h2 className="page-message">
          <span className="error-status">400:</span> Invalid or expired
          credentials
        </h2>
      )}
    </div>
  );
};

export default ResetPassword;
