import * as constants from "../constants";
export {};

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }

  interface HeaderProps {
    username: string;
    pageTitle: string;
  }

  interface TaskProps {
    _id: string;
    task_title: string;
    task_text: string;
    category: string;
    status: StatusType;
    created_on: Date | string;
    updated_on: Date | string | null;
    due_date: Date | string | null;
  }

  type PopupType =
    | constants.CONFIRM
    | constants.ALERT
    | constants.NEW_TASK
    | constants.NONE;

  type ThemeType = constants.LIGHT | constants.DARK;

  type StatusType = constants.ONGOING | constants.PENDING | constants.DONE;

  type SortByType =
    | constants.TITLE
    | constants.STATUS
    | constants.CREATED_ON
    | constants.DUE_BY;

  type SortDirectionType = constants.ASCENDING | constants.DESCENDING;

  type Task = {
    _id: string;
    category: string;
    status: StatusType;
    task_title: string;
    task_text: string;
    created_on: Date;
    updated_on: Date;
    due_date: Date;
  };

  type User = {
    username: string;
    password: string;
    logged_in: boolean;
    tasks: Array<Task>;
  };

  type Popup = {
    type: string;
    title?: string;
    content?: string;
  };

  type AnyFunction = (...args: any[]) => any;
}
