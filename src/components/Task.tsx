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

  return (
    <div className={`${status} task-cell`} id={_id}>
      <h3 className="task-title">{task_title}</h3>
      <button className="expand-collapse" onClick={toggleShowFull}>
        ▼
      </button>
      <div className="delete-task-btn">delete</div>
      {showFull && (
        <div className="task-content">
          <div className="task-text">{task_text}</div>
          <div className="task-category">{category}</div>
          <div className="task-status">{status}</div>
          <div className="created-on">Created on: {`${created_on}`}</div>
          {updated_on && (
            <div className="updated-on">Last updated: {`${updated_on}`}</div>
          )}
          {due_date && <div className="due-date">Due by: {`${due_date}`}</div>}
        </div>
      )}
    </div>
  );
};

export default Task;
