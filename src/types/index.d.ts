export {};

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }

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
