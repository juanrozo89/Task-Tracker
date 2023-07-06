import { useContext, useRef, useState, useEffect } from "react";
import Task from "../components/Task";
import RedirectToLogin from "../components/RedirectToLogin";
import { UserContext } from "../Contexts";
import useNewTaskPopup from "../hooks/useNewTaskPopup";
import { formatDateForDisplay } from "../utils/formatFunctions";
import {
  TITLE,
  STATUS,
  CREATED_ON,
  DUE_DATE,
  DONE,
  PENDING,
  ONGOING,
} from "../constants";

const TRUE = "true";
const FALSE = "false";

const MyTasks = () => {
  const { user } = useContext(UserContext)!;
  const filterKeywordRef = useRef<HTMLInputElement | null>(null);
  const setNewTaskPopup = useNewTaskPopup()!;
  const [sortBy, setSortBy] = useState<SortType>(CREATED_ON);
  const [sortOrderAscending, setSortOrderAscending] = useState<boolean>(true);
  const [tasksToShow, setTaskstoShow] = useState<Array<Task> | undefined>(
    user?.tasks
  );

  useEffect(() => {
    setTaskstoShow(user?.tasks);
  }, [user?.tasks]);

  useEffect(() => {
    sortTasks();
  }, [sortBy, sortOrderAscending]);

  const filterTasksByKeyword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let filteredTasks: Array<Task> = [];
    const dateKeys = ["created_on", "updated_on", "due_date"];
    const filterKeyword = filterKeywordRef.current?.value
      ? filterKeywordRef.current.value
      : null;
    if (!filterKeyword) {
      setTaskstoShow(user?.tasks);
      return;
    } else if (user?.tasks && user.tasks.length > 0) {
      let keyRegex = new RegExp(filterKeyword, "i");
      for (let task of user?.tasks) {
        for (let prop in task) {
          if (filteredTasks.indexOf(task) == -1 && (task as any)[prop]) {
            if (
              ((dateKeys as any[]).indexOf(prop) == -1 &&
                (task as any)[prop].match(keyRegex)) ||
              ((dateKeys as any[]).indexOf(prop) != -1 &&
                formatDateForDisplay((task as any)[prop]).match(keyRegex))
            ) {
              filteredTasks.unshift(task);
            }
          }
        }
      }
    }
    setTaskstoShow(filteredTasks);
  };

  const sortTasks = () => {
    const sortedTasks = [...tasksToShow!].sort((t1: Task, t2: Task) => {
      let toReturn = 0;
      const order = sortOrderAscending ? 1 : -1;
      const statusOrder: Record<StatusType, number> = {
        [DONE]: 3,
        [ONGOING]: 2,
        [PENDING]: 1,
      };
      switch (sortBy) {
        case TITLE:
          toReturn =
            t1.task_title.toLowerCase() < t2.task_title.toLowerCase()
              ? order
              : -order;
          break;
        case STATUS:
          toReturn =
            statusOrder[t1.status] < statusOrder[t2.status] ? order : -order;
          break;
        case CREATED_ON:
          toReturn = t1.created_on < t2.created_on ? order : -order;
          break;
        case DUE_DATE:
          toReturn = t1.due_date < t2.due_date ? order : -order;
          break;
      }
      return toReturn;
    });
    setTaskstoShow(sortedTasks);
  };

  const changeSelectSortBy = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const changeSelectSortOrder = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log(event.target.value);
    let val = event.target.value == TRUE ? true : false;
    setSortOrderAscending(val);
    console.log(sortOrderAscending);
  };

  return (
    <section id="my-tasks" className="content">
      <button id="add-task-button" onClick={setNewTaskPopup}>
        Add task
      </button>
      {tasksToShow ? (
        <>
          <div id="filter-sort-tasks-container">
            <label htmlFor="select-sort-by">Sort By:</label>
            <select
              id="select-sort-by"
              value={sortBy}
              onChange={changeSelectSortBy}
            >
              <option value={CREATED_ON}>created on</option>
              <option value={TITLE}>title</option>
              <option value={STATUS}>status</option>
              <option value={DUE_DATE}>due date</option>
            </select>
            <select id="select-sort-order" onChange={changeSelectSortOrder}>
              <option value={FALSE}>
                {sortBy == CREATED_ON || sortBy == DUE_DATE
                  ? "Earliest first"
                  : sortBy == TITLE
                  ? "A to Z"
                  : sortBy == STATUS
                  ? "Pending first"
                  : undefined}
              </option>
              <option value={TRUE}>
                {sortBy == CREATED_ON || sortBy == DUE_DATE
                  ? "Latest first"
                  : sortBy == TITLE
                  ? "Z to A"
                  : sortBy == STATUS
                  ? "Done first"
                  : undefined}
              </option>
            </select>
            <form id="filter-tasks-form" onSubmit={filterTasksByKeyword}>
              <input
                id="filter-tasks-input"
                type="text"
                placeholder="Filter by keyword(s)"
                ref={filterKeywordRef}
              ></input>
              <button id="filter-tasks-btn" type="submit">
                🔍
              </button>
            </form>
          </div>
          <div id="tasks-container">
            {tasksToShow.length > 0 ? (
              tasksToShow.map((task) => {
                return (
                  <Task
                    key={task._id}
                    _id={task._id}
                    category={task.category ? task!.category : ""}
                    status={task.status}
                    task_title={task.task_title}
                    task_text={task.task_text}
                    created_on={formatDateForDisplay(
                      task.created_on.toString()
                    )}
                    updated_on={
                      task.updated_on
                        ? formatDateForDisplay(task.updated_on.toString())
                        : null
                    }
                    due_date={
                      task.due_date
                        ? formatDateForDisplay(task.due_date.toString())
                        : null
                    }
                  />
                );
              })
            ) : (
              <p>No tasks to show</p>
            )}
          </div>
        </>
      ) : (
        <RedirectToLogin />
      )}
    </section>
  );
};

export default MyTasks;
