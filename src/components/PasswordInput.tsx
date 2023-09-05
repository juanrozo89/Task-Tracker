import { forwardRef, useState } from "react";
import { PASSWORD_LIMIT } from "../constants";

interface PasswordInputProps {
  id: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const { id } = props;
    const [viewPassword, setViewPassword] = useState<boolean>(false);

    const toggleViewPassword = () => {
      setViewPassword(!viewPassword);
    };

    return (
      <div className="password-input">
        <input
          type={viewPassword ? "text" : "password"}
          id={id}
          ref={ref}
          autoComplete="new-password"
          maxLength={PASSWORD_LIMIT}
          required
        />
        <div className="view-password-btn" onClick={toggleViewPassword}>
          👁
        </div>
      </div>
    );
  }
);

export default PasswordInput;
