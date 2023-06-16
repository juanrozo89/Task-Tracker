import { useContext } from "react";
import { NONE } from "../constants";

interface DialogProps {
  title: string;
  message: string;
  onConfirm: (...args: any[]) => any;
}

const ConfirmationDialog: React.FC<DialogProps> = ({
  title,
  message,
  onConfirm,
}) => {
  const handleConfirm = (_: React.MouseEvent<HTMLElement>) => {
    onConfirm();
  };

  const handleCancel = (_: React.MouseEvent<HTMLElement>) => {
    undefined;
  };

  return (
    <section id="confirmation-dialog">
      <div id="overlay"></div>
      <div id="dialog-box">
        <h3 id="confirmation-dialog-title">{title}</h3>
        <p id="confirmation-dialog-message">{message}</p>
        <div className="button-pair">
          <button id="confirm-button" onClick={handleConfirm}>
            Ok
          </button>
          <button id="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConfirmationDialog;
