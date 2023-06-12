import { useState, useEffect } from "react";
import { MAIN, MY_TASKS, PROFILE_SETTINGS } from "../constants";
import { useLocation, useNavigate } from "react-router-dom";

const useTitleModifier = (user: any) => {
  const [pageTitle, setPageTitle] = useState<string>(MAIN);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname == "/" && user) {
      setPageTitle(MY_TASKS);
    } else if (location.pathname == "/profile-settings") {
      setPageTitle(PROFILE_SETTINGS);
    } else {
      setPageTitle(MAIN);
    }
  }, [location]);

  return pageTitle;
};

export default useTitleModifier;
