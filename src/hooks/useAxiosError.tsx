import { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

const useAxiosError = (error: AxiosError<ErrorResponse>) => {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log("Error: ", error.message);
  }
};

export default useAxiosError;
