import useAxiosError from "../hooks/useAxiosError";
import { ALERT } from "../constants";
import { AxiosResponse } from "axios";

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
  useAxiosError(error);
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
