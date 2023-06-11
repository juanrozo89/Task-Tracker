import { StatusType, IN_PROGRESS, PENDING, ACCOMPLISHED } from "../constants";
import { useState } from "react";

interface TaskProps {
  _id: string;
  category: string;
  status: StatusType;
  task_title: string;
  task_text: string;
  created_on: Date;
  updated_on: Date | null;
  due_date: Date | null;
}

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

/*
`<div class="issue ${openstatus}" id="${id}" data-title="${title}">`,
              `<p class="issueId">id: ${id}</p>`,
              `<h3 class="issueTitle">${title} - (${openstatus})</h3>`,
              '<button class="expandCollapse">▼</button>',
              '<a href="#" class="closeDelete closeIssue">close</a><a href="#" class="closeDelete deleteIssue">delete</a>',
              '<div class="issueContent">',
                '<hr>',
                `<p>${text}</p>`,
                '<br>',
                `<p><b>Status:</b> ${status}</p>`,
                `<p><b>Created by:</b> ${createdBy}</p>`,
                `<p><b>Assigned to:</b> ${assignedTo}</p>`,
                `<p><b>Created on:</b> ${createdOn}</p>`,
                `<p><b>Last updated:</b> ${updatedOn}</p>`,
              '</div>',
            '</div>'
*/
