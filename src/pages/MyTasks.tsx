import Task from "../components/Task";
import RedirectToLogin from "../components/RedirectToLogin";
import { UserContext } from "../Contexts";
import { useContext } from "react";

const MyTasks = () => {
  const { user } = useContext(UserContext)!;
  const tasks = user?.tasks;
  return (
    <section id="my-tasks" className="content">
      <button id="add-task-button">Add task</button>
      {tasks ? (
        <div id="tasks-container">
          {tasks.length >= 1 ? (
            tasks.map((task) => {
              return (
                <Task
                  key={task._id}
                  _id={task._id}
                  category={task.category ? task.category : ""}
                  status={task.status}
                  task_title={task.task_title}
                  task_text={task.task_text}
                  created_on={task.created_on}
                  updated_on={task.updated_on ? task.updated_on : null}
                  due_date={task.due_date ? task.due_date : null}
                />
              );
            })
          ) : (
            <p>No tasks yet</p>
          )}
        </div>
      ) : (
        <RedirectToLogin />
      )}
    </section>
  );
};

export default MyTasks;
