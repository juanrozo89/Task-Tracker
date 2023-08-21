import { ALERT } from "../constants";
import axios, { AxiosResponse, AxiosError } from "axios";

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
  } else {
    console.log("Error: ", error.message);
  }
};

export const handleErrorAlert = (
  error: any,
  setPopupFunc: React.Dispatch<React.SetStateAction<Popup>>
) => {
  setPopupFunc({
    type: ALERT,
    title: "Error",
    content: axios.isCancel(error)
      ? "Connection issue or server delay. Please check your connection or try again later."
      : error.response?.status
      ? error.response.data.error
      : null,
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
