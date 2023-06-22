import { useContext } from "react";
import { NONE } from "../constants";
import { PopupContext } from "../Contexts";

const ConfirmationDialog = () => {
  const { popup, setPopup, onConfirm, setOnConfirm } =
    useContext(PopupContext)!;
  const title = popup.title;
  const message = popup.message;

  const clearPopup = () => {
    setPopup({
      type: NONE,
      title: "",
      message: "",
    });
    setOnConfirm(null);
  };

  const handleConfirm = (_: React.MouseEvent<HTMLElement>) => {
    onConfirm ? onConfirm() : undefined;
    clearPopup();
  };

  return (
    <section id="confirmation-dialog" className="popup">
      <div className="overlay"></div>
      <div className="popup-box">
        <h3 className="popup-title">{title}</h3>
        <p
          className="popup-message"
          dangerouslySetInnerHTML={{ __html: message }}
        ></p>
        <div className="button-pair">
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
