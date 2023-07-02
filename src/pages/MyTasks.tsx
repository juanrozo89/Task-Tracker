import { useContext, useRef, useState, useEffect } from "react";
import Task from "../components/Task";
import RedirectToLogin from "../components/RedirectToLogin";
import { UserContext } from "../Contexts";
import useNewTaskPopup from "../hooks/useNewTaskPopup";
import { formatDateForDisplay } from "../utils/formatFunctions";

const MyTasks = () => {
  const { user } = useContext(UserContext)!;
  const filterKeywordRef = useRef<HTMLInputElement | null>(null);
  const setNewTaskPopup = useNewTaskPopup()!;
  const [tasksToShow, setTaskstoShow] = useState<Array<Task> | undefined>(
    user?.tasks
  );
  useEffect(() => {
    setTaskstoShow(user?.tasks);
  }, [user?.tasks]);

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
    console.log(filteredTasks);
    setTaskstoShow(filteredTasks);
  };

  return (
    <section id="my-tasks" className="content">
      <button id="add-task-button" onClick={setNewTaskPopup}>
        Add task
      </button>
      {tasksToShow ? (
        <>
          <div id="filter-tasks-container">
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
