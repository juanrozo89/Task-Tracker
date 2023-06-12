// Page titles
export const MAIN = "Task Tracker";
export const ABOUT = "About Task Tracker";
export const MY_TASKS = "My Tasks";
export const API = "API Reference";
export const PROFILE_SETTINGS = "Profile Settings";
export const LOG_IN = "Log In";
export const SIGN_UP = "Sign Up";
export const NO_PAGE = "Not Found";

// Popup types
export type Popup = "confirm" | "alert" | "";
export const CONFIRM: Popup = "confirm";
export const ALERT: Popup = "alert";
export const NONE: Popup = "";

// Theme options
export type Theme = "light" | "dark";
export const LIGHT: Theme = "light";
export const DARK: Theme = "dark";

// Task status
export type StatusType = "In progress" | "Pending" | "Accomplished";
export const IN_PROGRESS: StatusType = "In progress";
export const PENDING: StatusType = "Pending";
export const ACCOMPLISHED: StatusType = "Accomplished";
