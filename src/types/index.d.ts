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
    category: string;
    status: StatusType;
    task_title: string;
    task_text: string;
    created_on: Date;
    updated_on: Date | null;
    due_date: Date | null;
  }

  type PopupType = "confirm" | "alert" | "";
  type ThemeType = "light" | "dark";
  type StatusType = "In progress" | "Pending" | "Accomplished";

  type User = {
    username: string;
    password: string;
    logged_in: boolean;
    tasks: Array<any>;
  };

  type Popup = {
    type: string;
    title: string;
    message: string;
  };

  type AnyFunction = (...args: any[]) => any;
}
