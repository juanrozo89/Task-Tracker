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
  const initialDateRef = useRef<HTMLInputElement | null>(null);
  const finalDateRef = useRef<HTMLInputElement | null>(null);
  const [tasksToShow, setTasksToShow] = useState<Array<Task> | undefined>(
    user?.tasks
  );

  useEffect(() => {
    filterTasksByField();
  }, [user?.tasks]);

  const sortTasks = (tasks: Array<Task> | undefined) => {
    const sortBy = sortByRef.current?.value;
    console.log("SORTING BY: " + sortBy);
    console.log("tasks length before sorting: " + tasks?.length);
    const sortedTasks = tasks
      ? [...tasks].sort((t1: Task, t2: Task) => {
          let toReturn = 0;
          const order = sortOrderRef.current?.value == ORDER_1 ? -1 : 1;
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
                statusOrder[t1.status] < statusOrder[t2.status]
                  ? order
                  : -order;
              break;
            case CREATED_ON:
              toReturn = t1.created_on < t2.created_on ? -order : order;
              break;
            case DUE_DATE:
              console.log("T1 due date: " + t1.due_date);
              console.log("T2 due date: " + t2.due_date);
              if (t1.due_date && t2.due_date) {
                console.log("both dates exist");
                toReturn = t1.due_date < t2.due_date ? order : -order;
              } else if (t1.due_date) {
                console.log(
                  "date for t1 exists but not for t2, so t1 comes first if ascending"
                );
                toReturn = order;
              } else if (t2.due_date) {
                console.log(
                  "date for t2 exists but not for t1, so t2 comes first if ascending"
                );
                toReturn = -order;
              } else {
                console.log("neither date exists, so don't sort");
                toReturn = 0;
              }
              console.log("to return after due date sorting: " + toReturn);
              break;
          }
          return toReturn;
        })
      : undefined;
    console.log(
      "sortedTasks length returned after sorting: " + sortedTasks?.length
    );
    setTasksToShow(sortedTasks);
    return sortedTasks;
  };

  const filterTasksByField = () => {
    const filterByField = filterByFieldRef.current?.value;
    console.log("FILTERING BY FIELD: " + filterByField);
    if (filterByField == SHOW_ALL) {
      console.log("total user tasks: " + user?.tasks.length);
      const tasksToReturn = sortTasks(user?.tasks!);
      return tasksToReturn;
    } else {
      let filteredTasks: Array<Task> = [...user?.tasks!];
      console.log(
        "tasks length before filtering by field: " + filteredTasks.length
      );
      const filterByCategoryValue =
        filterByCategoryValueRef.current?.value || categories[0];
      const filterByStatusValue = filterByStatusValueRef.current?.value || DONE;
      filteredTasks = filteredTasks?.filter((task) => {
        let toReturn = true;
        if (
          (filterByField == STATUS && task.status !== filterByStatusValue) ||
          (filterByField == CATEGORY && task.category !== filterByCategoryValue)
        ) {
          toReturn = false;
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
              (!dueDate ||
                (initDate && dueDate < initDate) ||
                (finalDate && dueDate > finalDate)))
          ) {
            toReturn = false;
          }
        }
        return toReturn;
      });
      console.log(
        "tasks length after filtering by field: " + filteredTasks.length
      );
      const tasksToReturn = sortTasks(filteredTasks);
      console.log(
        "tasks to return after filtering by field: " + tasksToReturn?.length
      );
      return tasksToReturn;
    }
  };

  const filterTasksByKeyword = () => {
    console.log(
      "ENTERED FILTERING BY KEYWORD: " + filterKeywordRef.current?.value
    );
    const tasksToFilter = filterTasksByField();
    console.log("should have logged the filterTasksByField console logs");
    console.log("tasks to filter by keyword: " + tasksToFilter?.length);
    const filterKeyword = filterKeywordRef.current?.value
      ? filterKeywordRef.current.value
      : null;
    console.log("filtering by keyword '" + filterKeyword + "'");
    if (!filterKeyword) {
      console.log("no keyword");
      return;
    } else if (tasksToFilter && tasksToFilter.length > 0) {
      console.log(
        "number of tasks to show before filtering by kw: " +
          tasksToFilter.length
      );
      let filteredTasks: Array<Task> = [...tasksToFilter!];
      console.log(
        "number of tasks to filter by kw after initializing array: " +
          filteredTasks.length
      );
      const dateKeys: Array<string> = ["created_on", "due_date"];
      let keyRegex = new RegExp(filterKeyword, "i");
      filteredTasks = filteredTasks.filter((task) => {
        let toReturn = false;
        for (let prop in task) {
          console.log(prop, (task as any)[prop]);
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
      console.log(
        "number of tasks after filter by kw: " + filteredTasks.length
      );
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
                <option value={DUE_DATE}>Due date</option>
                <option value={CREATED_ON}>Created on</option>
                <option value={STATUS}>Status</option>
                <option value={CATEGORY}>Category</option>
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
                    category={task.category ? task!.category : ""}
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
