import { useContext } from "react";
import { NONE } from "../constants";
import { PopupContext } from "../Contexts";

const AlertBox = () => {
  const { popup, setPopup } = useContext(PopupContext)!;
  const title = popup.title;
  const content = popup.content;

  const closeAlert = (_: React.MouseEvent<HTMLElement>) => {
    setPopup({
      type: NONE,
      title: "",
      content: "",
    });
  };

  return (
    <section id="alert-box" className="popup">
      <div className="overlay"></div>
      <div className="popup-box">
        <h3 className="popup-title">{title}</h3>
        <p
          className="popup-content"
          dangerouslySetInnerHTML={{ __html: content! }}
        ></p>
        <button className="confirm-btn" onClick={closeAlert}>
          Ok
        </button>
      </div>
    </section>
  );
};

export default AlertBox;
