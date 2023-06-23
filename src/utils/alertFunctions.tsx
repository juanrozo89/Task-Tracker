import { ALERT } from "../constants";
import { AxiosResponse } from "axios";
import { AxiosError } from "axios";

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
  if (error.response.status) {
    setPopupFunc({
      type: ALERT,
      title: "Error",
      message: `${error.response.data.error}`,
    });
  }
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
    message: result,
  });
};
