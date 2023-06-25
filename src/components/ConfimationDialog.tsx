import { useContext } from "react";
import { NONE } from "../constants";
import { PopupContext } from "../Contexts";

const ConfirmationDialog = () => {
  const { popup, setPopup, onConfirm, setOnConfirm } =
    useContext(PopupContext)!;
  const title = popup.title;
  const content = popup.content;

  const clearPopup = () => {
    setPopup({
      type: NONE,
      title: "",
      content: "",
    });
    setOnConfirm(null);
  };

  const handleConfirm = () => {
    onConfirm ? onConfirm() : undefined;
    clearPopup();
  };

  return (
    <section id="confirmation-dialog" className="popup">
      <div className="overlay"></div>
      <div className="popup-box">
        <h3 className="popup-title">{title}</h3>
        <p
          className="popup-content"
          dangerouslySetInnerHTML={{ __html: content! }}
        ></p>
        <div className="popup-buttons">
          <button className="confirm-button" onClick={handleConfirm}>
            Ok
          </button>
          <button className="cancel-button" onClick={clearPopup}>
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConfirmationDialog;
