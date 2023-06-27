import { useState, useContext } from "react";
import { UserContext, PopupContext } from "../Contexts";
import { CONFIRM } from "../constants";

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

  const deleteTask = () => {
    const request = () => {
      axios
        .delete("/api/delete-task", { data: { _id: _id } })
        .then((res) => {
          handleSuccessAlert(res, setPopup);
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
        <h3 className="task-title">{task_title}</h3>
        {showFull ? (
          <button className="expand-collapse" onClick={toggleShowFull}>
            ⏶
          </button>
        ) : (
          <button className="expand-collapse" onClick={toggleShowFull}>
            ⏷
          </button>
        )}
      </div>
      {showFull && (
        <div className="task-content">
          <div className="task-category">
            <span className="task-info-subtitle">Category: </span>
            {category}
          </div>
          <div className="task-text">{task_text}</div>
          <div className="task-status">{status}</div>
          {due_date && (
            <div className="due-date">
              <span className="task-info-subtitle">Due by:</span>
              <br /> {`${formattedDate(due_date)}`}
            </div>
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
            delete
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
