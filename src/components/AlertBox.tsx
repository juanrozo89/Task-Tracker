import { useContext } from "react";
import { NONE } from "../constants";
import { PopupContext } from "../Contexts";

const AlertBox = () => {
  const { popup, setPopup } = useContext(PopupContext)!;
  const title = popup.title;
  const message = popup.message;

  const closeAlert = (_: React.MouseEvent<HTMLElement>) => {
    setPopup({
      type: NONE,
      title: "",
      message: "",
    });
  };

  return (
    <section id="alert-box" className="popup">
      <div className="overlay"></div>
      <div className="popup-box">
        <h3 id="popup-title">{title}</h3>
        <p id="popup-message" dangerouslySetInnerHTML={{ __html: message }}></p>
        <button className="confirm-button" onClick={closeAlert}>
          Ok
        </button>
      </div>
    </section>
  );
};

export default AlertBox;
