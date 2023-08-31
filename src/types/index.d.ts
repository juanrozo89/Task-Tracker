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

  interface ErrorBoundaryProps {
    children: ReactNode;
    fallback: ReactElement;
  }

  interface ErrorBoundaryState {
    hasError: boolean;
  }

  type PopupType =
    | constants.CONFIRM
    | constants.ALERT
    | constants.NEW_TASK
    | constants.NONE;

  type ThemeType = constants.LIGHT | constants.DARK;

  type StatusType = constants.ONGOING | constants.PENDING | constants.DONE;

  type PriorityType =
    | constants.URGENT_PRIORITY
    | constants.HIGH_PRIORITY
    | constants.MEDIUM_PRIORITY
    | constants.LOW_PRIORITY;

  type SortType =
    | constants.TITLE
    | constants.STATUS
    | constants.CREATED_ON
    | constants.DUE_DATE;

  type FilterType =
    | constants.STATUS
    | constants.CATEGORY
    | constants.DUE_DATE
    | constants.CREATED_ON;

  type SortOrderType = constants.ASCENDING | constants.DESCENDING;

  type Task = {
    _id: string;
    category: string;
    status: StatusType;
    priority: PriorityType;
    task_title: string;
    task_text: string;
    created_on: Date | string;
    accomplished_on: Date | string | null;
    due_date: Date | string | null;
  };

  type User = {
    username: string;
    password: string;
    email: string;
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
