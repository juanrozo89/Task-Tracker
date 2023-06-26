import { useContext, useRef, useState } from "react";
import { NONE } from "../constants";
import { PopupContext, UserContext } from "../Contexts";
import { handleSuccessAlert, handleErrorAlert } from "../utils/alertFunctions";

import axios from "axios";

const NewTask = () => {
  const { setPopup } = useContext(PopupContext)!;
  const { setUser } = useContext(UserContext)!;

  const titleRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState<string>("");
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState<string>("");
  const categoryRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<string>("");
  const dueDateRef = useRef<HTMLInputElement>(null);
  const [dueDate, setDueDate] = useState<string>("");

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const clearPopup = () => {
    setPopup({
      type: NONE,
      title: "",
      content: "",
    });
  };

  const addNewTask = () => {
    axios
      .post("/api/new-task", {
        task_title: title,
        task_text: text,
        category: category,
        due_date: dueDate,
      })
      .then((res) => {
        //handleSuccessAlert(res, setPopup);
        setUser((prevUser) => ({
          ...prevUser!,
          tasks: res.data.tasks,
        }));
      })
      .catch((error) => {
        handleErrorAlert(error, setPopup);
      });
    clearPopup();
  };

  return (
    <section id="alert-box" className="popup">
      <div className="overlay"></div>
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
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <br />
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              name="task_description"
              ref={textRef}
              onChange={(e) => setText(e.target.value)}
            />
            <br />
            <label htmlFor="category">Category*</label>
            <input
              id="catgeory"
              type="text"
              name="category"
              placeholder="*Category"
              ref={categoryRef}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <br />
            <label htmlFor="due-date">Due date</label>
            <input
              id="due-date"
              type="date"
              name="due_date"
              placeholder="Due Date"
              ref={dueDateRef}
              min={formattedDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <br />
          </form>
        </div>
        <div className="popup-buttons">
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

export default NewTask;
