import { useState, useContext, useRef } from "react";
import { UserContext, PopupContext } from "../Contexts";
import { CONFIRM, PENDING, ONGOING, DONE } from "../constants";
import SelectCategory from "./SelectCategory";

import axios from "axios";
import { handleSuccessAlert, handleErrorAlert } from "../utils/alertFunctions";
import { getFormattedCurrentDate } from "../utils/formatFunctions";

const Task: React.FC<Task> = ({
  _id,
  category,
  status,
  task_title,
  task_text,
  created_on,
  //updated_on,
  due_date,
}) => {
  const [showFull, setShowAll] = useState<boolean>(false);

  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<boolean>(false);
  const [editingText, setEditingText] = useState<boolean>(false);
  const [editingDueDate, setEditingDueDate] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<boolean>(false);

  const editTitleRef = useRef<HTMLInputElement | null>(null);
  const editTextRef = useRef<HTMLTextAreaElement | null>(null);
  const editDueDateRef = useRef<HTMLInputElement | null>(null);

  const [updatedCategory, setUpdatedCategory] = useState<string>("");
  const handleCategoryChange = (updatedCat: string) => {
    setUpdatedCategory(updatedCat);
  };

  const { setPopup, setOnConfirm } = useContext(PopupContext)!;
  const { setUser } = useContext(UserContext)!;

  const formattedCurrentDate = getFormattedCurrentDate();

  const toggleShowFull = () => {
    setShowAll(!showFull);
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

  return (
    <div className={`${status} task-cell`} id={_id}>
      <div className="task-header">
        {editingTitle && editingTask ? (
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
                Apply
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
            <h3 className="task-title">
              {status == DONE ? (
                <span className="check-mark">🗹&nbsp;&nbsp;</span>
              ) : status == ONGOING ? (
                <span className="ongoing-mark">🞔&nbsp;&nbsp;</span>
              ) : undefined}
              {task_title}
              {editingTask && (
                <>
                  &nbsp;&nbsp;&nbsp;
                  <span
                    className="edit-task-text-btn link"
                    onClick={() => setEditingTitle(true)}
                  >
                    ｢🖉｣
                  </span>
                </>
              )}
            </h3>
          </>
        )}
        {!editingTask && (
          <button className="expand-collapse" onClick={toggleShowFull}>
            {showFull ? "⏶" : "⏷"}
          </button>
        )}
      </div>
      {showFull && (
        <div className="task-content">
          {editingCategory && editingTask ? (
            <div className="edit-task-category-container">
              <label htmlFor={`edit-category-${_id}`}>New category:</label>
              <br />
              <SelectCategory
                _id={`edit-category-${_id}`}
                changeCategory={handleCategoryChange}
              ></SelectCategory>
              <div className="edit-category-buttons small-btn-pair">
                <button
                  className="edit-category-btn confirm-edit-category-btn"
                  onClick={editCategory}
                >
                  Apply
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
              {category}
              {editingTask && (
                <>
                  &nbsp;&nbsp;&nbsp;
                  <span
                    className="edit-task-category-btn link"
                    onClick={() => setEditingCategory(true)}
                  >
                    ｢🖉｣
                  </span>
                </>
              )}
            </div>
          )}

          {editingText && editingTask ? (
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
                  Apply
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
              {task_text}
              {editingTask && (
                <>
                  &nbsp;&nbsp;&nbsp;
                  <span
                    className="edit-task-text-btn link"
                    onClick={() => setEditingText(true)}
                  >
                    ｢🖉｣
                  </span>
                </>
              )}
            </div>
          ) : (
            editingTask && (
              <div
                className="add-task-text link"
                onClick={() => setEditingText(true)}
              >
                <i>[Add description]</i>
              </div>
            )
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
          {editingDueDate && editingTask ? (
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
                  Apply
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
              <br /> {due_date as string}
              {editingTask && (
                <>
                  &nbsp;&nbsp;&nbsp;
                  <span
                    className="edit-task-due-date-btn link"
                    onClick={() => setEditingDueDate(true)}
                  >
                    ｢🖉｣
                  </span>
                </>
              )}
            </div>
          ) : (
            editingTask && (
              <div
                className="add-task-due_date link"
                onClick={() => setEditingDueDate(true)}
              >
                <i>[Add due date]</i>
              </div>
            )
          )}
          <div className="created-on">
            <span className="task-info-subtitle">Created on:</span>
            <br /> {created_on as string}
          </div>
          {/*{updated_on && (
            <div className="updated-on">
              <span className="task-info-subtitle">Last updated:</span>
              <br />
              {updated_on as string}
            </div>
          )}*/}
          <div className="small-btn-pair">
            {editingTask ? (
              <button
                className="edit-task-btn"
                onClick={() => setEditingTask(false)}
              >
                Done
              </button>
            ) : (
              <button
                className="edit-task-btn"
                onClick={() => setEditingTask(true)}
              >
                Edit
              </button>
            )}
            <button className="delete-task-btn" onClick={confirmDeleteTask}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
