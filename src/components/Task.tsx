import { useState, useContext, useRef } from "react";
import { UserContext, PopupContext } from "../Contexts";
import { CONFIRM, PENDING, ONGOING, DONE } from "../constants";

import axios from "axios";
import { handleSuccessAlert, handleErrorAlert } from "../utils/alertFunctions";
import useExistingCategories from "../hooks/useExistingCategories";

const Task: React.FC<TaskProps> = ({
  _id,
  category,
  status,
  task_title,
  task_text,
  created_on,
  updated_on,
  due_date,
}) => {
  const [showFull, setShowAll] = useState<boolean>(false);

  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<boolean>(false);
  const [editingText, setEditingText] = useState<boolean>(false);
  const [editingDueDate, setEditingDueDate] = useState<boolean>(false);

  const editTitleRef = useRef<HTMLInputElement | null>(null);
  const editCategoryRef = useRef<any>(null);
  const editTextRef = useRef<HTMLTextAreaElement | null>(null);
  const editDueDateRef = useRef<HTMLInputElement | null>(null);

  const { setPopup, setOnConfirm } = useContext(PopupContext)!;
  const { setUser } = useContext(UserContext)!;

  const categories = useExistingCategories();
  const [newCategory, setNewCategory] = useState<boolean>(true);
  const NEW_CATEGORY = "new-category";

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedCurrentDate = `${year}-${month}-${day}`;

  const toggleShowFull = () => {
    setShowAll(!showFull);
  };

  const formatDate = (date: Date) => {
    const dateF = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric" as const,
      month: "long" as const,
      day: "numeric" as const,
      hour: "numeric" as const,
      minute: "numeric" as const,
    };

    const fDate = dateF.toLocaleDateString("en-US", options);
    return fDate;
  };

  const changeStatus = (status: StatusType) => {
    axios
      .put("/api/update-task", { _id: _id, status: status })
      .then((res) => {
        setUser((prevUser) => ({
          ...prevUser!,
          tasks: res.data.tasks,
        }));
      })
      .catch((error) => {
        handleErrorAlert(error, setPopup);
      });
  };

  const editTitle = () => {
    const updatedTitle = editTitleRef.current?.value
      ? editTitleRef.current.value
      : null;
    axios
      .put("/api/update-task", { _id: _id, task_title: updatedTitle })
      .then((res) => {
        setUser((prevUser) => ({
          ...prevUser!,
          tasks: res.data.tasks,
        }));
      })
      .catch((error) => {
        handleErrorAlert(error, setPopup);
      });
    setEditingTitle(false);
  };

  const editCategory = () => {
    const updatedCategory = editCategoryRef.current?.value
      ? editCategoryRef.current.value
      : null;
    axios
      .put("/api/update-task", { _id: _id, category: updatedCategory })
      .then((res) => {
        setUser((prevUser) => ({
          ...prevUser!,
          tasks: res.data.tasks,
        }));
      })
      .catch((error) => {
        handleErrorAlert(error, setPopup);
      });
    setEditingCategory(false);
    setNewCategory(true);
  };

  const editText = () => {
    const updatedText = editTextRef.current?.value
      ? editTextRef.current.value
      : "";
    axios
      .put("/api/update-task", { _id: _id, task_text: updatedText })
      .then((res) => {
        setUser((prevUser) => ({
          ...prevUser!,
          tasks: res.data.tasks,
        }));
      })
      .catch((error) => {
        handleErrorAlert(error, setPopup);
      });
    setEditingText(false);
  };

  const editDueDate = () => {
    const updatedDueDate = editDueDateRef.current?.value
      ? editDueDateRef.current.value
      : "";
    axios
      .put("/api/update-task", { _id: _id, due_date: updatedDueDate })
      .then((res) => {
        setUser((prevUser) => ({
          ...prevUser!,
          tasks: res.data.tasks,
        }));
      })
      .catch((error) => {
        handleErrorAlert(error, setPopup);
      });
    setEditingDueDate(false);
  };

  const deleteTask = () => {
    const request = () => {
      axios
        .delete("/api/delete-task", { data: { _id: _id } })
        .then((res) => {
          // handleSuccessAlert(res, setPopup);
          setUser((prevUser) => ({
            ...prevUser!,
            tasks: res.data.tasks,
          }));
        })
        .catch((error) => {
          handleErrorAlert(error, setPopup);
        });
    };
    return request;
  };

  const confirmDeleteTask = () => {
    setPopup({
      type: CONFIRM,
      title: "Confirm",
      content: `Are you sure you want to delete task '${task_title}'?`,
    });
    setOnConfirm(deleteTask);
  };

  const selectCategory = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCat = event.target.value;
    if (selectedCat == NEW_CATEGORY) {
      setNewCategory(true);
    } else {
      setNewCategory(false);
    }
  };

  return (
    <div className={`${status} task-cell`} id={_id}>
      <div className="task-header">
        {editingTitle ? (
          <div className="edit-task-title-container">
            <label htmlFor={`edit-title-${_id}`}>New title:</label>
            <input
              id={`edit-title-${_id}`}
              className="edit-task-title-input"
              defaultValue={task_title}
              ref={editTitleRef}
            ></input>
            <div className="edit-text-buttons small-btn-pair">
              <button
                className="edit-text-btn confirm-edit-text-btn"
                onClick={editTitle}
              >
                Edit
              </button>
              <button
                className="edit-text-btn cancel-button cancel-edit-text-btn"
                onClick={() => setEditingTitle(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {" "}
            <h3 className="task-title">
              {task_title}&nbsp;&nbsp;&nbsp;
              <span
                className="edit-task-text-btn link"
                onClick={() => setEditingTitle(true)}
              >
                ｢🖉｣
              </span>
            </h3>
          </>
        )}
        <button className="expand-collapse" onClick={toggleShowFull}>
          {showFull ? "⏶" : "⏷"}
        </button>
      </div>
      {showFull && (
        <div className="task-content">
          {editingCategory ? (
            <div className="edit-task-category-container">
              <label htmlFor={`edit-category-${_id}`}>New category:</label>
              <br />
              <select
                id={`edit-category-${_id}`}
                onChange={selectCategory}
                className={newCategory ? "inactive-input" : ""}
                ref={!newCategory ? editCategoryRef : undefined}
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
                  ref={editCategoryRef}
                  required
                />
              )}
              <div className="edit-category-buttons small-btn-pair">
                <button
                  className="edit-category-btn confirm-edit-category-btn"
                  onClick={editCategory}
                >
                  Edit
                </button>
                <button
                  className="edit-category-btn cancel-button cancel-edit-category-btn"
                  onClick={() => setEditingCategory(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="task-category">
              <span className="task-info-subtitle">Category: </span>
              {category}&nbsp;&nbsp;&nbsp;
              <span
                className="edit-task-category-btn link"
                onClick={() => setEditingCategory(true)}
              >
                ｢🖉｣
              </span>
            </div>
          )}

          {editingText ? (
            <div className="edit-task-text-container">
              <label htmlFor={`edit-text-${_id}`}>New description:</label>
              <textarea
                id={`edit-text-${_id}`}
                className="edit-task-text-area"
                defaultValue={task_text}
                ref={editTextRef}
              ></textarea>
              <div className="edit-text-buttons small-btn-pair">
                <button
                  className="edit-text-btn confirm-edit-text-btn"
                  onClick={editText}
                >
                  Edit
                </button>
                <button
                  className="edit-text-btn cancel-button cancel-edit-text-btn"
                  onClick={() => setEditingText(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : task_text ? (
            <div className="task-text">
              {task_text}&nbsp;&nbsp;&nbsp;
              <span
                className="edit-task-text-btn link"
                onClick={() => setEditingText(true)}
              >
                ｢🖉｣
              </span>
            </div>
          ) : (
            <div
              className="add-task-text link"
              onClick={() => setEditingText(true)}
            >
              <i>[Add description]</i>
            </div>
          )}
          <div className="task-status-container">
            <div
              className={
                status == PENDING
                  ? "task-status pending-status current-status"
                  : "task-status pending-status"
              }
              onClick={() => changeStatus(PENDING)}
            >
              {PENDING}
            </div>
            <div
              className={
                status == ONGOING
                  ? "task-status ongoing-status current-status"
                  : "task-status ongoing-status"
              }
              onClick={() => changeStatus(ONGOING)}
            >
              {ONGOING}
            </div>
            <div
              className={
                status == DONE
                  ? "task-status done-status current-status"
                  : "task-status done-status"
              }
              onClick={() => changeStatus(DONE)}
            >
              {DONE}
            </div>
          </div>
          {editingDueDate ? (
            <div className="edit-task-due-date-container">
              <label htmlFor={`edit-due-date-${_id}`}>New due date:</label>
              <br />
              <input
                id={`edit-due-date-${_id}`}
                type="date"
                className="edit-task-due-date-input"
                defaultValue={due_date?.toString()}
                min={formattedCurrentDate}
                ref={editDueDateRef}
              ></input>
              <div className="edit-due-date-buttons small-btn-pair">
                <button
                  className="edit-due-date-btn confirm-edit-due-date-btn"
                  onClick={editDueDate}
                >
                  Edit
                </button>
                <button
                  className="edit-due-date-btn cancel-button cancel-edit-due-date-btn"
                  onClick={() => setEditingDueDate(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : due_date ? (
            <div className="due-date">
              <span className="task-info-subtitle">Due by:</span>
              <br /> {`${formatDate(due_date)}`}&nbsp;&nbsp;&nbsp;
              <span
                className="edit-task-due-date-btn link"
                onClick={() => setEditingDueDate(true)}
              >
                ｢🖉｣
              </span>
            </div>
          ) : (
            <div
              className="add-task-due_date link"
              onClick={() => setEditingDueDate(true)}
            >
              <i>[Add due date]</i>
            </div>
          )}
          <div className="created-on">
            <span className="task-info-subtitle">Created on:</span>
            <br /> {`${formatDate(created_on)}`}
          </div>
          {updated_on && (
            <div className="updated-on">
              <span className="task-info-subtitle">Last updated:</span>
              <br />
              {`${formatDate(updated_on)}`}
            </div>
          )}
          <div className="delete-task-btn" onClick={confirmDeleteTask}>
            Delete
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
