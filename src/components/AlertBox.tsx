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
    <section id="alert-box">
      <div className="overlay"></div>
      <div id="alert-box-content">
        <h3 id="alert-title">{title}</h3>
        <p id="alert-message" dangerouslySetInnerHTML={{ __html: message }}></p>
        <button id="confirm-button" onClick={closeAlert}>
          Ok
        </button>
      </div>
    </section>
  );
};

export default AlertBox;
