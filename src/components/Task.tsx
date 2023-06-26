import { useState } from "react";

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
          <div className="task-text">{task_text}</div>
          <div className="task-category">
            <span className="task-info-subtitle">Category: </span>
            {category}
          </div>
          <div className="task-status">- {status} -</div>
          <div className="created-on">
            <span className="task-info-subtitle">Created on: </span>{" "}
            {`${formattedDate(created_on)}`}
          </div>
          {updated_on && (
            <div className="updated-on">
              <span className="task-info-subtitle">Last updated: </span>
              {`${formattedDate(updated_on)}`}
            </div>
          )}
          {due_date && (
            <div className="due-date">
              <span className="task-info-subtitle">Due by: </span>{" "}
              {`${formattedDate(due_date)}`}
            </div>
          )}
          <div className="delete-task-btn">delete</div>
        </div>
      )}
    </div>
  );
};

export default Task;
