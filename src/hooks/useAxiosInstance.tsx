import { REQ_TIMEOUT_CLIENT } from "../constants";
import axios from "axios";

const useAxiosInstance = () => {
  const axiosInstance = axios.create();
  axiosInstance.defaults.signal = AbortSignal.timeout(REQ_TIMEOUT_CLIENT);
  return axiosInstance;
};

export default useAxiosInstance;
