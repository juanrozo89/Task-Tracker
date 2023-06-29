import { useState, useContext, useRef } from "react";
import { UserContext, PopupContext } from "../Contexts";
import { CONFIRM, PENDING, ONGOING, DONE } from "../constants";

import axios from "axios";
import { handleSuccessAlert, handleErrorAlert } from "../utils/alertFunctions";

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
  const editCategoryRef = useRef<HTMLInputElement | null>(null);
  const editTextRef = useRef<HTMLTextAreaElement | null>(null);
  const editDueDateRef = useRef<HTMLInputElement | null>(null);

  const { setPopup, setOnConfirm } = useContext(PopupContext)!;
  const { setUser } = useContext(UserContext)!;

  const toggleShowFull = () => {
    setShowAll(!showFull);
  };

  const formattedDate = (date: Date) => {
    const dateF = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric" as const,
      month: "long" as const,
      day: "numeric" as const,
      hour: "numeric" as const,
      minute: "numeric" as const,
    };

    const formattedDate = dateF.toLocaleDateString("en-US", options);
    return formattedDate;
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
    const newTitle = editTitleRef.current?.value
      ? editTitleRef.current.value
      : null;
    axios
      .put("/api/update-task", { _id: _id, task_title: newTitle })
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
    const newCategory = editCategoryRef.current?.value
      ? editCategoryRef.current.value
      : null;
    axios
      .put("/api/update-task", { _id: _id, category: newCategory })
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
  };

  const editText = () => {
    const newText = editTextRef.current?.value ? editTextRef.current.value : "";
    axios
      .put("/api/update-task", { _id: _id, task_text: newText })
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
    const newDueDate = editDueDateRef.current?.value
      ? editDueDateRef.current.value
      : null;
    axios
      .put("/api/update-task", { _id: _id, due_date: newDueDate })
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

  return (
    <div className={`${status} task-cell`} id={_id}>
      <div className="task-header">
        {editingTitle ? (
          <div className="edit-task-title-container">
            <input
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
              {task_title}{" "}
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
          <div className="task-category">
            <span className="task-info-subtitle">Category: </span>
            {category}
          </div>
          {editingText ? (
            <div className="edit-task-text-container">
              <textarea
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
          {due_date ? (
            <div className="due-date">
              <span className="task-info-subtitle">Due by:</span>
              <br /> {`${formattedDate(due_date)}`}
            </div>
          ) : (
            <div></div>
          )}
          <div className="created-on">
            <span className="task-info-subtitle">Created on:</span>
            <br /> {`${formattedDate(created_on)}`}
          </div>
          {updated_on && (
            <div className="updated-on">
              <span className="task-info-subtitle">Last updated:</span>
              <br />
              {`${formattedDate(updated_on)}`}
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
