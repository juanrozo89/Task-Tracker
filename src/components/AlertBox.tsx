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
        <h3 className="popup-title">{title}</h3>
        <p
          className="popup-message"
          dangerouslySetInnerHTML={{ __html: message }}
        ></p>
        <div className="popup-buttons">
          <button className="confirm-button" onClick={closeAlert}>
            Ok
          </button>
        </div>
      </div>
    </section>
  );
};

export default AlertBox;
