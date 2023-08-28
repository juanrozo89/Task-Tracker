import { REQ_TIMEOUT_CLIENT } from "../constants";
import axios from "axios";

/*const useAxiosInstance = () => {
  const axiosInstance =
    axios.create();
  axiosInstance.defaults.signal = AbortSignal.timeout(REQ_TIMEOUT_CLIENT);
  return axiosInstance;
};*/

const useAxiosInstance = () => {
  //const controller = new AbortController();
  const axiosInstance = axios.create({
    timeout: REQ_TIMEOUT_CLIENT,
  });
  //axiosInstance.defaults.cancelToken = controller.signal;
  return axiosInstance;
};

export default useAxiosInstance;
