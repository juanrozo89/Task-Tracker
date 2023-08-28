import { ALERT } from "../constants";
import { AxiosResponse, AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

export const handleAxiosError = (error: AxiosError<ErrorResponse>) => {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    console.log(error.request);
  } else if (error.message) {
    console.log(error.message);
  } else {
    console.log(error);
  }
};

export const handleErrorAlert = (
  error: any,
  setPopupFunc: React.Dispatch<React.SetStateAction<Popup>>
) => {
  setPopupFunc({
    type: ALERT,
    title: "Error",
    content: error.response?.status
      ? error.response.data.error
      : "Connection issue or server delay. Please check your connection or try again later.",
  });
  /*if (axios.isCancel(error)) {
    setPopupFunc({
      type: ALERT,
      title: "Error",
      content: "Request timeout reached",
    });
  } else if (error.response.status) {
    setPopupFunc({
      type: ALERT,
      title: "Error",
      content: error.response.data.error,
    });
  }*/
  handleAxiosError(error);
};

export const handleSuccessAlert = (
  res: AxiosResponse,
  setPopupFunc: React.Dispatch<React.SetStateAction<Popup>>
) => {
  const result = `${res.data.result}`;
  console.log(result);
  setPopupFunc({
    type: ALERT,
    title: "Success",
    content: result,
  });
};
