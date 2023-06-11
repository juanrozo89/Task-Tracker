import { useState, useEffect, createContext } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

import * as constants from "./constants";
import "./styles/styles.scss";

import Layout from "./pages/Layout";
import LogIn from "./pages/LogIn";
import About from "./pages/About";
import NoPage from "./pages/NoPage";
import ProfileSettings from "./pages/ProfileSettings";
import SignUp from "./pages/SignUp";
import MyTasks from "./pages/MyTasks";

const getGreeting = async function () {
  const res = await fetch("/api/test");
  return await res.json();
};

function App() {
  const [greeting, setGreeting] = useState("");

  const [user, setUser] = useState<any>(null);
  const [currentPage, setPage] = useState<string>(constants.MAIN);
  const [popup, setPopup] = useState<string>(constants.NONE);

  const ThemeContext = createContext(constants.LIGHT);
  const [theme, setTheme] = useState<constants.Theme>(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? (storedTheme as constants.Theme) : constants.LIGHT;
  });

  useEffect(() => {
    // Add this hook
    getGreeting().then((res) => setGreeting(res.greeting));
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    theme == constants.LIGHT
      ? setTheme(constants.DARK)
      : setTheme(constants.LIGHT);
  };

  return (
    <>
      {/*<h1>Vite + React</h1>
      <p>Server response: {greeting}</p>*/}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                username={user ? user.username : ""}
                currentPage={currentPage}
                theme={theme}
                toggleThemeFunc={toggleTheme}
              />
            }
          >
            <Route index element={<LogIn />} />
            {user ? (
              <>
                <Route
                  path={`profile-settings/${user.username}`}
                  element={<ProfileSettings user={user} />}
                />
                <Route
                  path={`my-tasks/${user.username}`}
                  element={<MyTasks tasks={user.tasks} />}
                />
              </>
            ) : (
              <>
                <Route
                  path={`profile-settings/:username`}
                  element={<ProfileSettings user={user} />}
                />
                <Route
                  path={`my-tasks/:username`}
                  element={<MyTasks tasks={null} />}
                />
              </>
            )}
            <Route path="sign-up" element={<SignUp />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
