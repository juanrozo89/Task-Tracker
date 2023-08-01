import { useState, useContext, useRef } from "react";
import { UserContext, PopupContext } from "../Contexts";
import {
  CONFIRM,
  PENDING,
  ONGOING,
  DONE,
  URGENT_PRIORITY,
  HIGH_PRIORITY,
  MEDIUM_PRIORITY,
  LOW_PRIORITY,
} from "../constants";
import SelectCategory from "./SelectCategory";
import Loading from "./Loading";

import axios from "axios";
import { handleSuccessAlert, handleErrorAlert } from "../utils/alertFunctions";
import { getFormattedCurrentDate } from "../utils/formatFunctions";

const Task: React.FC<Task> = ({
  _id,
  category,
  status,
  priority,
  task_title,
  task_text,
  created_on,
  accomplished_on,
  due_date,
}) => {
  const [showFull, setShowAll] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [editingTitle, setEditingTitle] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<boolean>(false);
  const [editingPriority, setEditingPriority] = useState<boolean>(false);
  const [editingText, setEditingText] = useState<boolean>(false);
  const [editingDueDate, setEditingDueDate] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<boolean>(false);

  const editTitleRef = useRef<HTMLInputElement | null>(null);
  const editTextRef = useRef<HTMLTextAreaElement | null>(null);
  const editDueDateRef = useRef<HTMLInputElement | null>(null);
  const updatedPriorityRef = useRef<HTMLSelectElement | null>(null);

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
    let accomplished_on = null;
    if (status === DONE) {
      accomplished_on = new Date();
    } else {
      accomplished_on = "";
    }

    setIsLoading(true);
    axios
      .put("/api/update-task", {
        _id: _id,
        status: status,
        accomplished_on: accomplished_on,
      })
      .then((res) => {
        setUser((prevUser) => ({
          ...prevUser!,
          tasks: res.data.tasks,
        }));
      })
      .catch((error) => {
        handleErrorAlert(error, setPopup);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const editTitle = () => {
    const updatedTitle = editTitleRef.current?.value
      ? editTitleRef.current.value
      : null;

    setIsLoading(true);
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
      })
      .finally(() => {
        setIsLoading(false);
      });
    setEditingTitle(false);
  };

  const editCategory = () => {
    setIsLoading(true);
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
      })
      .finally(() => {
        setIsLoading(false);
      });
    setEditingCategory(false);
  };

  const editPriority = () => {
    const updatedPriority = updatedPriorityRef.current?.value || null;

    setIsLoading(true);
    axios
      .put("/api/update-task", { _id: _id, priority: updatedPriority })
      .then((res) => {
        setUser((prevUser) => ({
          ...prevUser!,
          tasks: res.data.tasks,
        }));
      })
      .catch((error) => {
        handleErrorAlert(error, setPopup);
      })
      .finally(() => {
        setIsLoading(false);
      });
    setEditingPriority(false);
  };

  const editText = () => {
    const updatedText = editTextRef.current?.value
      ? editTextRef.current.value
      : "";

    setIsLoading(true);
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
      })
      .finally(() => {
        setIsLoading(false);
      });
    setEditingText(false);
  };

  const editDueDate = () => {
    const updatedDueDate = editDueDateRef.current?.value
      ? editDueDateRef.current.value
      : "";

    setIsLoading(true);
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
      })
      .finally(() => {
        setIsLoading(false);
      });
    setEditingDueDate(false);
  };

  const deleteTask = () => {
    const request = () => {
      setIsLoading(true);
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
        })
        .finally(() => {
          setIsLoading(false);
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
    <>
      {isLoading && <Loading />}
      <div className={`${status} task-cell`} id={_id}>
        <div className="task-header">
          {/*--TITLE--*/}
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
                {/*---STATUS ON TITLE---*/}
                {status == DONE ? (
                  <span className="check-mark">🗹&nbsp;&nbsp;</span>
                ) : status == ONGOING ? (
                  <span className="ongoing-mark">🞔&nbsp;&nbsp;</span>
                ) : status == PENDING ? (
                  <span className="pending-mark">⏹&nbsp;&nbsp;</span>
                ) : undefined}

                {/*---PRIORITY ON TITLE---*/}
                {priority == URGENT_PRIORITY ? (
                  <span className="urgent-priority-mark">‼&nbsp;&nbsp;</span>
                ) : priority == HIGH_PRIORITY ? (
                  <span className="high-priority-mark">
                    !&nbsp;&nbsp;
                  </span> /*: priority == MEDIUM_PRIORITY ? (
                <span className="medium-priority-mark">↠&nbsp;&nbsp;</span>
              )*/
                ) : priority == LOW_PRIORITY ? (
                  <span className="low-priority-mark">↡&nbsp;&nbsp;</span>
                ) : undefined}

                {/*---TITLE---*/}
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
            {/*--PRIORITY--*/}
            {editingPriority && editingTask ? (
              <div className="edit-task-priority">
                <label htmlFor={`edit-priority-${_id}`}>Priority:</label>
                <br />
                <select
                  id={`edit-priority-${_id}`}
                  ref={updatedPriorityRef}
                  defaultValue={
                    priority == URGENT_PRIORITY
                      ? URGENT_PRIORITY
                      : priority == HIGH_PRIORITY
                      ? HIGH_PRIORITY
                      : priority == MEDIUM_PRIORITY
                      ? MEDIUM_PRIORITY
                      : LOW_PRIORITY
                  }
                >
                  <option value={URGENT_PRIORITY}>Urgent</option>
                  <option value={HIGH_PRIORITY}>High</option>
                  <option value={MEDIUM_PRIORITY}>Medium</option>
                  <option value={LOW_PRIORITY}>Low</option>
                </select>
                <div className="edit-priority-buttons small-btn-pair">
                  <button
                    className="edit-priority-btn confirm-edit-priority-btn"
                    onClick={editPriority}
                  >
                    Apply
                  </button>
                  <button
                    className="edit-priority-btn cancel-button cancel-edit-priority-btn"
                    onClick={() => setEditingPriority(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="task-priority">
                <span className="task-info-subtitle">Priority: </span>
                {priority}
                {editingTask && (
                  <>
                    &nbsp;&nbsp;&nbsp;
                    <span
                      className="edit-task-priority-btn link"
                      onClick={() => setEditingPriority(true)}
                    >
                      ｢🖉｣
                    </span>
                  </>
                )}
              </div>
            )}

            {/*--CATEGORY--*/}
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

            {/*--DESCRIPTION--*/}
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

            {/*--STATUS--*/}
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

            {/*---DUE DATE---*/}
            {editingDueDate && editingTask ? (
              <div className="edit-task-due-date-container">
                <label htmlFor={`edit-due-date-${_id}`}>New due date:</label>
                <br />
                <input
                  id={`edit-due-date-${_id}`}
                  type="datetime-local"
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

            {/*--CREATED ON--*/}
            <div className="created-on">
              <span className="task-info-subtitle">Created on:</span>
              <br /> {created_on as string}
            </div>

            {/*--ACCOMPLISHED ON--*/}
            {accomplished_on && (
              <div className="accomplsihed-on">
                <span className="task-info-subtitle">Accomplished on:</span>
                <br />
                {accomplished_on as string}
              </div>
            )}

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
    </>
  );
};

export default Task;
