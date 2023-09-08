import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import ConfirmationDialog from "../components/ConfimationDialog";
import AlertBox from "../components/AlertBox";
import NewTaskPopup from "../components/NewTaskPopup";
import { ThemeContext, PopupContext } from "../Contexts";
import { NONE, CONFIRM, ALERT, NEW_TASK } from "../constants";

const Layout: React.FC<HeaderProps> = ({ username, pageTitle }) => {
  const { theme } = useContext(ThemeContext)!;
  const [popup, setPopup] = useState<Popup>({
    type: NONE,
    title: "",
    content: "",
  });
  const [onConfirm, setOnConfirm] = useState<AnyFunction | null>(null);

  return (
    <PopupContext.Provider value={{ popup, setPopup, onConfirm, setOnConfirm }}>
      <div className={theme}>
        <Header username={username} pageTitle={pageTitle} />
        <Outlet />
        {popup.type == CONFIRM && <ConfirmationDialog></ConfirmationDialog>}
        {popup.type == NEW_TASK && <NewTaskPopup></NewTaskPopup>}
        {popup.type == ALERT && <AlertBox></AlertBox>}
      </div>
    </PopupContext.Provider>
  );
};

export default Layout;
