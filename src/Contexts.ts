import { createContext } from "react";

// THEME CONTEXT
interface ThemeContextValues {
  theme: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValues | null>(null);

// USER CONTEXT
interface UserContextValues {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextValues | null>(null);

// POPUP CONTEXT

interface PopupContextValues {
  popup: Popup;
  setPopup: React.Dispatch<React.SetStateAction<Popup>>;
  onConfirm: AnyFunction | null;
  setOnConfirm: React.Dispatch<React.SetStateAction<AnyFunction | null>>;
}

export const PopupContext = createContext<PopupContextValues | null>(null);
