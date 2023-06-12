import { useState, useEffect } from "react";
import { Theme, LIGHT, DARK } from "../constants";
import { useLocation, useNavigate } from "react-router-dom";

const useThemeHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? (storedTheme as Theme) : LIGHT;
  });

  // preserve location when changing theme
  useEffect(() => {
    navigate(location.pathname);
  }, [theme]);

  // save theme in local storage
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    theme == LIGHT ? setTheme(DARK) : setTheme(LIGHT);
  };

  return { theme, toggleTheme };
};

export default useThemeHandler;
