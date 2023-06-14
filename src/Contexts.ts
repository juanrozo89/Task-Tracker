import { createContext } from "react";

interface ThemeContextValues {
  theme: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValues | null>(null);

type User = {
  username: string;
  password: string;
  logged_in: boolean;
  tasks: Array<any>;
};

interface UserContextValues {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const UserContext = createContext<UserContextValues | null>(null);
