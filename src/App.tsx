import { Route, Routes } from "react-router-dom";
import "./styles/styles.scss";
import { useState } from "react";

// contexts
import { ThemeContext, UserContext, IsLoadingContext } from "./Contexts";

// custom hooks
import useThemeHandler from "./hooks/useThemeHandler";
import useTitleModifier from "./hooks/useTitleModifier";
import useUserSession from "./hooks/useUserSession";
import useFetchReadme from "./hooks/useFetchReadme";

// pages
import Layout from "./pages/Layout";
import LogIn from "./pages/LogIn";
import About from "./pages/About";
import NoPage from "./pages/NoPage";
import InternalError from "./pages/InternalError";
import ProfileSettings from "./pages/ProfileSettings";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import MyTasks from "./pages/MyTasks";

// components
import Loading from "./components/Loading";

const App = () => {
  const [internalError, setInternalError] = useState<string | null>(null);
  const { user, setUser } = useUserSession(setInternalError);
  const [isLoading, setIsLoading] = useState<boolean>(false)!;

  const { theme, toggleTheme } = useThemeHandler();
  const pageTitle = useTitleModifier(user);
  const readmeContent = useFetchReadme();

  return (
    <>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <IsLoadingContext.Provider value={{ isLoading, setIsLoading }}>
          {isLoading && <Loading />}
          <UserContext.Provider value={{ user, setUser }}>
            {/* Preload loading image */}
            <img
              style={{ display: "none" }}
              src="/src/images/loading1.gif"
              alt="Loading"
            />
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
                {internalError ? (
                  <>
                    <Route
                      index
                      element={<InternalError message={internalError} />}
                    />
                    <Route
                      path={"profile-settings"}
                      element={<InternalError message={internalError} />}
                    />
                    <Route
                      path="sign-up"
                      element={<InternalError message={internalError} />}
                    />
                  </>
                ) : (
                  <>
                    <Route index element={user ? <MyTasks /> : <LogIn />} />
                    <Route
                      path={"profile-settings"}
                      element={<ProfileSettings />}
                    />
                    <Route
                      path={"reset-password"}
                      element={<ResetPassword />}
                    />
                    <Route path="sign-up" element={<SignUp />} />
                  </>
                )}
                <Route
                  path="about"
                  element={<About content={readmeContent} />}
                />
                <Route path="*" element={<NoPage />} />
              </Route>
            </Routes>
          </UserContext.Provider>
        </IsLoadingContext.Provider>
      </ThemeContext.Provider>
    </>
  );
};

export default App;
