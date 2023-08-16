import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./styles/styles.scss";

// contexts
import { ThemeContext, UserContext } from "./Contexts";

// custom hooks
import useThemeHandler from "./hooks/useThemeHandler";
import useTitleModifier from "./hooks/useTitleModifier";
import useUserSession from "./hooks/useUserSession";

// pages
import Layout from "./pages/Layout";
import LogIn from "./pages/LogIn";
import About from "./pages/About";
import NoPage from "./pages/NoPage";
import InternalError from "./pages/InternalError";
import ProfileSettings from "./pages/ProfileSettings";
import SignUp from "./pages/SignUp";
import MyTasks from "./pages/MyTasks";

function App() {
  const { user, setUser } = useUserSession();

  const { theme, toggleTheme } = useThemeHandler();
  const pageTitle = useTitleModifier(user);

  const location = useLocation();
  const [hasInternalError, setHasInternalError] = useState<boolean>(true);

  useEffect(() => {
    const img = new Image();
    img.src = "/src/images/loading1.gif";
  }, []);

  useEffect(() => {
    if (location.state && location.state.error) {
      console.log("LOCATION ERROR: " + location.state.error);
      setHasInternalError(true);
    } else {
      setHasInternalError(false);
    }
  }, [location]);

  return (
    <>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <UserContext.Provider value={{ user, setUser }}>
          <h1 id="location-error">Location error: {location.state?.error}</h1>
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
              {hasInternalError ? (
                <>
                  <Route index element={<InternalError />} />
                  <Route
                    path={"profile-settings"}
                    element={<InternalError />}
                  />
                  <Route path="sign-up" element={<InternalError />} />
                </>
              ) : (
                <>
                  <Route index element={user ? <MyTasks /> : <LogIn />} />
                  <Route
                    path={"profile-settings"}
                    element={<ProfileSettings />}
                  />
                  <Route path="sign-up" element={<SignUp />} />
                </>
              )}
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
