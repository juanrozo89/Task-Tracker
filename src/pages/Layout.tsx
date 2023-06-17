import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Header, { HeaderProps } from "../components/Header";
import ConfirmationDialog from "../components/ConfimationDialog";
import { ThemeContext, PopupContext } from "../Contexts";
import { NONE, CONFIRM, ALERT } from "../constants";

const Layout: React.FC<HeaderProps> = ({ username, pageTitle }) => {
  const { theme } = useContext(ThemeContext)!;
  const [popup, setPopup] = useState<Popup>({
    type: NONE,
    title: "",
    message: "",
  });
  const [onConfirm, setOnConfirm] = useState<AnyFunction | null>(null);

  return (
    <PopupContext.Provider value={{ popup, setPopup, onConfirm, setOnConfirm }}>
      <div className={theme}>
        <Header username={username} pageTitle={pageTitle} />
        <hr />
        <Outlet />
        {popup.type == CONFIRM && <ConfirmationDialog></ConfirmationDialog>}
      </div>
    </PopupContext.Provider>
  );
};

export default Layout;
