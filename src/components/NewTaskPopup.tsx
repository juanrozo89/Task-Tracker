import { useContext, useRef, useState } from "react";
import {
  NONE,
  URGENT_PRIORITY,
  HIGH_PRIORITY,
  MEDIUM_PRIORITY,
  LOW_PRIORITY,
} from "../constants";
import { PopupContext, UserContext } from "../Contexts";
import { handleErrorAlert } from "../utils/alertFunctions";
import { getFormattedCurrentDate } from "../utils/formatFunctions";
import SelectCategory from "./SelectCategory";
import Loading from "./Loading";

import axios from "axios";

const NewTaskPopup = () => {
  const { setPopup } = useContext(PopupContext)!;
  const { setUser } = useContext(UserContext)!;

  const titleRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);
  const formattedCurrentDate = getFormattedCurrentDate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [category, setCategory] = useState<string>("");
  const handleCategoryChange = (updatedCat: string) => {
    setCategory(updatedCat);
  };

  const [priority, setPriority] = useState<string>(MEDIUM_PRIORITY);
  const handlePriorityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPriority(event.target.value);
  };

  const clearPopup = () => {
    setPopup({
      type: NONE,
      title: "",
      content: "",
    });
  };

  const addNewTask = () => {
    const title = titleRef.current?.value ? titleRef.current.value : "";
    const text = textRef.current?.value ? textRef.current.value : "";
    const dueDate = dueDateRef.current?.value ? dueDateRef.current.value : "";
    setIsLoading(true);
    axios
      .post("/api/new-task", {
        task_title: title,
        task_text: text,
        category: category,
        priority: priority,
        due_date: dueDate,
      })
      .then((res) => {
        //handleSuccessAlert(res, setPopup);
        setUser((prevUser) => ({
          ...prevUser!,
          tasks: res.data.tasks,
        }));
        clearPopup();
      })
      .catch((error) => {
        handleErrorAlert(error, setPopup);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <section id="alert-box" className="popup">
      {isLoading ? <Loading /> : <div className="overlay"></div>}
      <div className="popup-box">
        <h3 className="popup-title">Add a new task</h3>
        <div className="popup-content">
          <form id="new-task-form" className="left-aligned-form">
            <label htmlFor="task-title">Title*</label>
            <input
              id="task-title"
              type="text"
              name="task_title"
              ref={titleRef}
              required
            />
            <br />
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              name="task_description"
              ref={textRef}
            />
            <br />
            <label htmlFor="select-category">Category*</label>
            <SelectCategory
              _id={"select-category"}
              changeCategory={handleCategoryChange}
            ></SelectCategory>
            <br />
            <label htmlFor="select-priority">Priority*</label>
            <select
              id="select-priority"
              onChange={handlePriorityChange}
              defaultValue={MEDIUM_PRIORITY}
            >
              <option value={URGENT_PRIORITY}>Urgent</option>
              <option value={HIGH_PRIORITY}>High</option>
              <option value={MEDIUM_PRIORITY}>Medium</option>
              <option value={LOW_PRIORITY}>Low</option>
            </select>
            <label htmlFor="due-date">Due date</label>
            <input
              id="due-date"
              type="datetime-local"
              name="due_date"
              ref={dueDateRef}
              min={formattedCurrentDate}
            />
            <br />
          </form>
        </div>
        <div className="large-btn-pair">
          <button className="confirm-button" type="submit" onClick={addNewTask}>
            Ok
          </button>
          <button className="cancel-button" onClick={clearPopup}>
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewTaskPopup;
