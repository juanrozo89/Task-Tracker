import { useContext } from "react";
import { PopupContext } from "../Contexts";
import { NEW_TASK } from "../constants";

const useNewTaskPopup = () => {
  const { setPopup } = useContext(PopupContext)!;
  const setNewTaskPopup = () => {
    setPopup({
      type: NEW_TASK,
      title: "Add a new task",
    });
  };
  return setNewTaskPopup;
};

export default useNewTaskPopup;
