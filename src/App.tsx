import { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import useThemeHandler from "./hooks/useThemeHandler";

import * as constants from "./constants";
import "./styles/styles.scss";

import { ThemeContext } from "./Contexts";

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
  const [popup, setPopup] = useState<string>(constants.NONE);
  const [pageTitle, setPageTitle] = useState<string>(constants.MAIN);

  const location = useLocation();

  const { theme, toggleTheme } = useThemeHandler();

  useEffect(() => {
    getGreeting().then((res) => setGreeting(res.greeting));
  }, []);

  // change main title in certain pages
  useEffect(() => {
    if (location.pathname == "/" && user) {
      setPageTitle(constants.MY_TASKS);
    } else if (location.pathname == "/profile-settings") {
      setPageTitle(constants.PROFILE_SETTINGS);
    } else {
      setPageTitle(constants.MAIN);
    }
  }, [location]);

  return (
    <>
      {/*<h1>Vite + React</h1>
      <p>Server response: {greeting}</p>*/}
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                username={user ? user.username : ""}
                pageTitle={pageTitle}
              />
            }
          >
            <Route
              index
              element={user ? <MyTasks tasks={user.tasks} /> : <LogIn />}
            />
            <Route
              path={"profile-settings"}
              element={<ProfileSettings user={user} />}
            />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="about" element={<About />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
