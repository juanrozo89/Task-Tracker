import { useContext, useRef, useState } from "react";
import { NONE } from "../constants";
import { PopupContext, UserContext } from "../Contexts";
import { handleErrorAlert } from "../utils/alertFunctions";
import useExistingCategories from "../hooks/useExistingCategories";

import axios from "axios";

const NewTaskPopup = () => {
  const { setPopup } = useContext(PopupContext)!;
  const { setUser } = useContext(UserContext)!;
  const categories = useExistingCategories();

  const titleRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState<string>("");
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState<string>("");
  const categoryRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<string>("");
  const [newCategory, setNewCategory] = useState<boolean>(true);
  const NEW_CATEGORY = "new-category";
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

  const selectCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCat = event.target.value;
    if (selectedCat == NEW_CATEGORY) {
      setNewCategory(true);
    } else {
      setNewCategory(false);
      setCategory(selectedCat);
    }
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
            <select
              onChange={selectCategory}
              className={newCategory ? "inactive-input" : ""}
            >
              <option value={NEW_CATEGORY} className="italic">
                {" "}
                - New category -{" "}
              </option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {newCategory && (
              <input
                id="catgeory"
                type="text"
                name="category"
                ref={categoryRef}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            )}
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
