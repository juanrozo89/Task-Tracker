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
  PRIORITY,
  SHOW_ALL,
  LOW_PRIORITY,
  MEDIUM_PRIORITY,
  HIGH_PRIORITY,
  URGENT_PRIORITY,
} from "../constants";

const ORDER_1 = "order1";
const ORDER_2 = "order2";

const MyTasks = () => {
  const { user } = useContext(UserContext)!;
  const filterKeywordRef = useRef<HTMLInputElement | null>(null);
  const setNewTaskPopup = useNewTaskPopup()!;
  const categories = useExistingCategories();
  const sortByRef = useRef<HTMLSelectElement | null>(null);
  const sortOrderRef = useRef<HTMLSelectElement | null>(null);
  const filterByFieldRef = useRef<HTMLSelectElement | null>(null);
  const filterByStatusValueRef = useRef<HTMLSelectElement | null>(null);
  const filterByCategoryValueRef = useRef<HTMLSelectElement | null>(null);
  const filterByPriorityValueRef = useRef<HTMLSelectElement | null>(null);
  const initialDateRef = useRef<HTMLInputElement | null>(null);
  const finalDateRef = useRef<HTMLInputElement | null>(null);
  const [tasksToShow, setTasksToShow] = useState<Array<Task> | undefined>(
    user?.tasks
  );

  useEffect(() => {
    filterTasksByKeyword();
  }, [user?.tasks]);

  const sortTasks = (tasks: Array<Task> | undefined) => {
    const sortBy = sortByRef.current?.value;
    const sortedTasks = tasks
      ? [...tasks].sort((t1: Task, t2: Task) => {
          let toReturn = 0;
          const order = sortOrderRef.current?.value == ORDER_1 ? -1 : 1;
          const priorityOrder: Record<StatusType, number> = {
            [URGENT_PRIORITY]: 1,
            [HIGH_PRIORITY]: 2,
            [MEDIUM_PRIORITY]: 3,
            [LOW_PRIORITY]: 4,
          };
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
            case PRIORITY:
              toReturn =
                priorityOrder[t1.priority] < priorityOrder[t2.priority]
                  ? order
                  : -order;
              break;
            case STATUS:
              toReturn =
                statusOrder[t1.status] < statusOrder[t2.status]
                  ? order
                  : -order;
              break;
            case CREATED_ON:
              toReturn = t1.created_on < t2.created_on ? -order : order;
              break;
            case DUE_DATE:
              if (t1.due_date && t2.due_date) {
                toReturn = t1.due_date < t2.due_date ? order : -order;
              } else if (t1.due_date) {
                toReturn = order;
              } else if (t2.due_date) {
                toReturn = -order;
              } else {
                toReturn = 0;
              }
              break;
          }
          return toReturn;
        })
      : undefined;
    setTasksToShow(sortedTasks);
    return sortedTasks;
  };

  const filterTasksByField = () => {
    const filterByField = filterByFieldRef.current?.value;

    if (filterByField == SHOW_ALL) {
      const tasksToReturn = sortTasks(user?.tasks!);
      return tasksToReturn;
    } else {
      let filteredTasks: Array<Task> = [...user?.tasks!];

      const filterByCategoryValue =
        filterByCategoryValueRef.current?.value || categories[0];

      const filterByPriorityValue =
        filterByPriorityValueRef.current?.value || URGENT_PRIORITY;

      const filterByStatusValue = filterByStatusValueRef.current?.value || DONE;

      filteredTasks = filteredTasks?.filter((task) => {
        let includeTask = true;
        if (
          (filterByField == STATUS && task.status !== filterByStatusValue) ||
          (filterByField == CATEGORY &&
            task.category !== filterByCategoryValue) ||
          (filterByField == PRIORITY && task.priority !== filterByPriorityValue)
        ) {
          includeTask = false;
        } else {
          const createdOn = new Date(task.created_on);
          const dueDate = task.due_date ? new Date(task.due_date) : null;
          const initDate = initialDateRef.current?.value
            ? new Date(initialDateRef.current?.value)
            : null;
          const finalDate = finalDateRef.current?.value
            ? new Date(finalDateRef.current?.value)
            : null;

          if (
            (filterByField == CREATED_ON &&
              ((initDate && createdOn < initDate) ||
                (finalDate && createdOn > finalDate))) ||
            (filterByField == DUE_DATE &&
              (initDate || finalDate) &&
              (!dueDate ||
                (initDate && dueDate < initDate) ||
                (finalDate && dueDate > finalDate)))
          ) {
            includeTask = false;
          }
        }
        return includeTask;
      });
      const tasksToReturn = sortTasks(filteredTasks);
      return tasksToReturn;
    }
  };

  const filterTasksByKeyword = () => {
    const tasksToFilter = filterTasksByField();
    const filterKeyword = filterKeywordRef.current?.value
      ? filterKeywordRef.current.value
      : null;
    if (!filterKeyword) {
      return;
    } else if (tasksToFilter && tasksToFilter.length > 0) {
      let filteredTasks: Array<Task> = [...tasksToFilter!];
      const dateKeys: Array<string> = ["created_on", "due_date"];
      let keyRegex = new RegExp(filterKeyword, "i");
      filteredTasks = filteredTasks.filter((task) => {
        let toReturn = false;
        for (let prop in task) {
          if (
            (task as any)[prop] &&
            ((dateKeys.indexOf(prop) == -1 &&
              (task as any)[prop].match(keyRegex)) ||
              (dateKeys.indexOf(prop) != -1 &&
                formatDateForDisplay((task as any)[prop]).match(keyRegex)))
          ) {
            toReturn = true;
          }
        }
        return toReturn;
      });
      setTasksToShow(filteredTasks);
    }
  };

  return (
    <section id="my-tasks" className="content">
      <button id="add-task-button" onClick={setNewTaskPopup}>
        New task
      </button>
      {tasksToShow ? (
        <>
          <div id="filter-sort-tasks-container">
            <div id="sort-tasks-container">
              <label htmlFor="select-sort-by">Sort By:</label>
              <select
                id="select-sort-by"
                ref={sortByRef}
                onChange={() => sortTasks(tasksToShow)}
              >
                <option value={CREATED_ON}>Created on</option>
                <option value={TITLE}>Title</option>
                <option value={STATUS}>Status</option>
                <option value={PRIORITY}>Priority</option>
                <option value={DUE_DATE}>Due date</option>
              </select>
              <select
                id="select-sort-order"
                ref={sortOrderRef}
                onChange={() => sortTasks(tasksToShow)}
              >
                <option value={ORDER_1}>
                  {sortByRef.current?.value == CREATED_ON
                    ? "Newest first"
                    : sortByRef.current?.value == DUE_DATE
                    ? "Soonest first"
                    : sortByRef.current?.value == TITLE
                    ? "A to Z"
                    : sortByRef.current?.value == STATUS
                    ? "Pending First"
                    : sortByRef.current?.value == PRIORITY
                    ? "Urgent First"
                    : undefined}
                </option>
                <option value={ORDER_2}>
                  {sortByRef.current?.value == CREATED_ON
                    ? "Oldest first"
                    : sortByRef.current?.value == DUE_DATE
                    ? "Latest first"
                    : sortByRef.current?.value == TITLE
                    ? "Z to A"
                    : sortByRef.current?.value == STATUS
                    ? "Done first"
                    : sortByRef.current?.value == PRIORITY
                    ? "Low First"
                    : undefined}
                </option>
              </select>
            </div>
            <div id="filter-tasks-container">
              <label htmlFor="select-filter-by">Filter By:</label>
              <select
                id="select-filter-by-field"
                ref={filterByFieldRef}
                onChange={filterTasksByField}
              >
                <option value={SHOW_ALL}>- Show all -</option>
                <option value={CATEGORY}>Category</option>
                <option value={PRIORITY}>Priority</option>
                <option value={STATUS}>Status</option>
                <option value={DUE_DATE}>Due date</option>
                <option value={CREATED_ON}>Created on</option>
              </select>
              {filterByFieldRef.current?.value == DUE_DATE ||
              filterByFieldRef.current?.value == CREATED_ON ? (
                <div id="select-filter-value-dates-between">
                  <label htmlFor="initial-date-to-filter-by">From:</label>
                  <input
                    id="initial-date-to-filter-by"
                    ref={initialDateRef}
                    onChange={filterTasksByField}
                    type="date"
                  />
                  <label htmlFor="final-date-to-filter-by">To:</label>
                  <input
                    id="final-date-to-filter-by"
                    ref={finalDateRef}
                    onChange={filterTasksByField}
                    type="date"
                  />
                </div>
              ) : (
                filterByFieldRef.current?.value !== SHOW_ALL &&
                (filterByFieldRef.current?.value == STATUS ? (
                  <select
                    id="select-filter-by-field-value"
                    ref={filterByStatusValueRef}
                    onChange={filterTasksByField}
                  >
                    <option value={DONE}>Done</option>
                    <option value={ONGOING}>Ongoing</option>
                    <option value={PENDING}>Pending</option>
                  </select>
                ) : filterByFieldRef.current?.value == CATEGORY ? (
                  <select
                    id="select-filter-by-field-value"
                    ref={filterByCategoryValueRef}
                    onChange={filterTasksByField}
                  >
                    {categories.map((cat, index) => {
                      return (
                        <option key={`${cat}-${index}`} value={cat}>
                          {cat}
                        </option>
                      );
                    })}{" "}
                  </select>
                ) : filterByFieldRef.current?.value == PRIORITY ? (
                  <select
                    id="select-filter-by-field-value"
                    ref={filterByPriorityValueRef}
                    onChange={filterTasksByField}
                  >
                    <option value={URGENT_PRIORITY}>Urgent</option>
                    <option value={HIGH_PRIORITY}>High</option>
                    <option value={MEDIUM_PRIORITY}>Medium</option>
                    <option value={LOW_PRIORITY}>Low</option>
                  </select>
                ) : undefined)
              )}
            </div>
            <form id="filter-by-keyword-form">
              <label htmlFor="filter-by-keyword-input">
                Filter by keyword(s):
              </label>
              <input
                id="filter-by-keyword-input"
                type="text"
                ref={filterKeywordRef}
                onChange={filterTasksByKeyword}
              ></input>
            </form>
          </div>
          <div id="tasks-container">
            {tasksToShow.length > 0 ? (
              tasksToShow.map((task) => {
                return (
                  <Task
                    key={task._id}
                    _id={task._id}
                    category={task.category}
                    priority={task.priority}
                    status={task.status}
                    task_title={task.task_title}
                    task_text={task.task_text}
                    created_on={formatDateForDisplay(
                      task.created_on.toString()
                    )}
                    /*updated_on={
                      task.updated_on
                        ? formatDateForDisplay(task.updated_on.toString())
                        : null
                    }*/
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
