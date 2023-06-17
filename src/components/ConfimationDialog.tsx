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
    <section id="confirmation-dialog">
      <div id="overlay"></div>
      <div id="dialog-box">
        <h3 id="confirmation-dialog-title">{title}</h3>
        <p
          id="confirmation-dialog-message"
          dangerouslySetInnerHTML={{ __html: message }}
        ></p>
        <div className="button-pair">
          <button id="confirm-button" onClick={handleConfirm}>
            Ok
          </button>
          <button id="cancel-button" onClick={clearPopup}>
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConfirmationDialog;
