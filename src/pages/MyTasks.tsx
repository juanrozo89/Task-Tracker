import { useContext, useRef, useState, useEffect } from "react";
import Task from "../components/Task";
import RedirectToLogin from "../components/RedirectToLogin";
import { UserContext } from "../Contexts";
import useNewTaskPopup from "../hooks/useNewTaskPopup";
import useExistingCategories from "../hooks/useExistingCategories";
import { formatDateForDisplay } from "../utils/formatFunctions";
import {
  TITLE,
  STATUS,
  CREATED_ON,
  DUE_DATE,
  DONE,
  PENDING,
  ONGOING,
  CATEGORY,
  SHOW_ALL,
} from "../constants";

const TRUE = "true";
const FALSE = "false";

const MyTasks = () => {
  const { user } = useContext(UserContext)!;
  const filterKeywordRef = useRef<HTMLInputElement | null>(null);
  const setNewTaskPopup = useNewTaskPopup()!;
  const categories = useExistingCategories();
  const [sortBy, setSortBy] = useState<SortType>(CREATED_ON);
  const [sortOrderAscending, setSortOrderAscending] = useState<boolean>(true);
  const [filterByField, setFilterByField] = useState<FilterType>(CREATED_ON);
  const filterByFieldValueRef = useRef<HTMLSelectElement | null>(null);
  const initialDateRef = useRef<HTMLInputElement | null>(null);
  const finalDateRef = useRef<HTMLInputElement | null>(null);
  const [tasksToShow, setTaskstoShow] = useState<Array<Task> | undefined>(
    user?.tasks
  );

  useEffect(() => {
    setTaskstoShow(user?.tasks);
    sortTasks();
    if (filterByField == CREATED_ON || filterByField == DUE_DATE) {
      filterTasksByDate();
    } else {
      filterTasksByField();
    }
  }, [user?.tasks]);

  useEffect(() => {
    sortTasks();
  }, [sortBy, sortOrderAscending]);

  useEffect(() => {
    if (filterByField !== CREATED_ON || filterByField !== DUE_DATE) {
      filterTasksByField();
    } else {
      filterTasksByDate();
    }
  }, [filterByField]);

  const filterTasksByField = () => {
    if (filterByField == SHOW_ALL) {
      return;
    } else {
      let filteredTasks: Array<Task> = [...tasksToShow!];
      console.log("before filtering by field: " + filteredTasks.length);
      if (filterByField == STATUS) {
        filteredTasks = filteredTasks?.filter(
          (task) => task.status == filterByFieldValueRef.current?.value!
        );
      } else if (filterByField == CATEGORY) {
        filteredTasks = filteredTasks?.filter(
          (task) => task.category == filterByFieldValueRef.current?.value!
        );
      }
      console.log("after filtering by field: " + filteredTasks.length);
      setTaskstoShow(filteredTasks);
    }
  };

  const filterTasksByDate = () => {
    /*
    console.log("filtering tasks by date");
    console.log("initial date: " + initialDateRef.current?.value);
    console.log("final date: " + finalDateRef.current?.value);
    console.log("field to filter by: " + filterByField);
    console.log("filter by created on?: " + (filterByField == CREATED_ON));
    console.log("filter by due date?: " + (filterByField == DUE_DATE));
    */
    let filteredTasks: Array<Task> = [...tasksToShow!];
    console.log("before filter by date: " + filteredTasks.length);
    filteredTasks = filteredTasks?.filter((task) => {
      let toReturn = true;
      const createdOn = new Date(task.created_on);
      const dueDate = task.due_date ? new Date(task.due_date) : null;
      if (!dueDate) {
        return false;
      }
      const initDate = initialDateRef.current?.value
        ? new Date(initialDateRef.current?.value)
        : null;
      const finalDate = finalDateRef.current?.value
        ? new Date(finalDateRef.current?.value)
        : null;
      /*console.log("init date: " + initDate);
      console.log("final date: " + finalDate);
      console.log("task created on: " + createdOn);
      console.log("task due date: " + dueDate);*/
      if (
        (filterByField == CREATED_ON &&
          ((initDate && createdOn < initDate) ||
            (finalDate && createdOn > finalDate))) ||
        (filterByField == DUE_DATE &&
          ((initDate && dueDate < initDate) ||
            (finalDate && dueDate > finalDate)))
      ) {
        //console.log("indeed task didn't fit");
        toReturn = false;
      }
      //console.log("returns " + toReturn);
      return toReturn;
    });
    console.log("after filter by date: " + filteredTasks.length);
    setTaskstoShow(filteredTasks);
  };

  const filterTasksByKeyword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let filteredTasks: Array<Task> = [...tasksToShow!];
    console.log("before filter by keyword: " + filteredTasks.length);
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
    console.log("after filter by keyword: " + filteredTasks.length);
    setTaskstoShow(filteredTasks);
  };

  const changeFilterByField = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterByField(event.target.value);
  };

  const sortTasks = () => {
    console.log("before sorting: " + tasksToShow!.length);
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
    console.log("after sorting: " + sortedTasks.length);
    setTaskstoShow(sortedTasks);
  };

  const changeSelectSortBy = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const changeSelectSortOrder = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const val = event.target.value == TRUE ? true : false;
    setSortOrderAscending(val);
  };

  return (
    <section id="my-tasks" className="content">
      <button id="add-task-button" onClick={setNewTaskPopup}>
        Add task
      </button>
      {tasksToShow ? (
        <>
          <div id="filter-sort-tasks-container">
            <div id="sort-tasks-container">
              <label htmlFor="select-sort-by">Sort By:</label>
              <select
                id="select-sort-by"
                value={sortBy}
                onChange={changeSelectSortBy}
              >
                <option value={CREATED_ON}>Created on</option>
                <option value={TITLE}>Title</option>
                <option value={STATUS}>Status</option>
                <option value={DUE_DATE}>Due date</option>
              </select>
              <select
                id="select-sort-order"
                value={sortOrderAscending ? TRUE : FALSE}
                onChange={changeSelectSortOrder}
              >
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
            </div>
            <div id="filter-tasks-container">
              <label htmlFor="select-filter-by">Filter By:</label>
              <select
                id="select-filter-by-field"
                value={filterByField}
                onChange={changeFilterByField}
              >
                <option value={SHOW_ALL}>- Show all -</option>
                <option value={DUE_DATE}>Due date</option>
                <option value={CREATED_ON}>Created on</option>
                <option value={STATUS}>Status</option>
                <option value={CATEGORY}>Category</option>
              </select>
              {filterByField == DUE_DATE || filterByField == CREATED_ON ? (
                <div id="select-filter-value-dates-between">
                  <label htmlFor="initial-date-to-filter-by">From:</label>
                  <input
                    id="initial-date-to-filter-by"
                    ref={initialDateRef}
                    onChange={filterTasksByDate}
                    type="date"
                  />
                  <label htmlFor="final-date-to-filter-by">To:</label>
                  <input
                    id="final-date-to-filter-by"
                    ref={finalDateRef}
                    onChange={filterTasksByDate}
                    type="date"
                  />
                </div>
              ) : (
                filterByField !== SHOW_ALL && (
                  <select
                    id="select-filter-by-field-value"
                    ref={filterByFieldValueRef}
                    onChange={filterTasksByField}
                  >
                    {filterByField == STATUS ? (
                      <>
                        <option value={DONE}>Done</option>
                        <option value={ONGOING}>Ongoing</option>
                        <option value={PENDING}>Pending</option>
                      </>
                    ) : filterByField == CATEGORY ? (
                      categories.map((cat, index) => {
                        return (
                          <option key={`${cat}-${index}`} value={cat}>
                            {cat}
                          </option>
                        );
                      })
                    ) : undefined}
                  </select>
                )
              )}
            </div>
            <form id="filter-by-keyword-form" onSubmit={filterTasksByKeyword}>
              <label htmlFor="filter-by-keyword-input">
                Filter by keyword(s):
              </label>
              <input
                id="filter-by-keyword-input"
                type="text"
                placeholder="Filter by keyword(s)"
                ref={filterKeywordRef}
              ></input>
              <button id="filter-by-keyword-btn" type="submit">
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
