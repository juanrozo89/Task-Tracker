import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import * as constants from "./constants";
import "./styles/styles.scss";
// contexts
import { ThemeContext, UserContext } from "./Contexts";

// custom hooks
import useThemeHandler from "./hooks/useThemeHandler";
import useTitleModifier from "./hooks/useTitleModifier";

// pages
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
  const [greeting, setGreeting] = useState<string>("");

  const [user, setUser] = useState<any>(null);
  const [popup, setPopup] = useState<string>(constants.NONE);

  const { theme, toggleTheme } = useThemeHandler();
  const pageTitle = useTitleModifier(user);

  useEffect(() => {
    getGreeting().then((res) => setGreeting(res.greeting));
  }, []);

  return (
    <>
      {/*<h1>Vite + React</h1>
      <p>Server response: {greeting}</p>*/}
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <UserContext.Provider value={{ user, setUser }}>
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
        </UserContext.Provider>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
