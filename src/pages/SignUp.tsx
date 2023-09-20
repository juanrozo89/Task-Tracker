import { useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { UserContext, PopupContext, IsLoadingContext } from "../Contexts";

import { USERNAME_LIMIT, PASSWORD_LIMIT } from "../constants";

import TermsOfService from "../components/TermsOfService";
import PasswordInput from "../components/PasswordInput";

import DOMPurify from "dompurify";
import { handleErrorAlert, handleSuccessAlert } from "../utils/alertFunctions";
import useAxiosInstance from "../hooks/useAxiosInstance";
import useTermsOfService from "../hooks/useTermsOfService";

const SignUp = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const acceptTermsRef = useRef<HTMLInputElement>(null);
  const { setIsLoading } = useContext(IsLoadingContext)!;

  const [showTerms, setShowTerms] = useState<boolean>(false);
  const hideTerms = () => {
    setShowTerms(false);
  };
  const termsContent = useTermsOfService();

  const navigate = useNavigate();
  const axiosInstance = useAxiosInstance();

  const { setUser } = useContext(UserContext)!;
  const { setPopup } = useContext(PopupContext)!;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    axiosInstance
      .post("/api/sign-up", {
        username: DOMPurify.sanitize(usernameRef.current!.value),
        email: DOMPurify.sanitize(emailRef.current!.value),
        password: DOMPurify.sanitize(passwordRef.current!.value),
        accepted_terms: acceptTermsRef.current!.checked,
        confirm_password: DOMPurify.sanitize(confirmPasswordRef.current!.value),
      })
      .then((res) => {
        console.log(`${res.data.result}`);
        handleSuccessAlert(res, setPopup);
        setUser(res.data.user);
        navigate("/");
      })
      .catch((error) => {
        handleErrorAlert(error, setPopup);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {showTerms && (
        <>
          <div className="overlay"></div>
          <TermsOfService
            hideFunction={hideTerms}
            termsContent={termsContent}
          ></TermsOfService>
        </>
      )}
      <section id="sign-up" className="content">
        <h2>Register a new account:</h2>
        <form onSubmit={handleSubmit}>
          {/*   USERNAME   */}
          <label htmlFor="signup-username">Username: </label>
          <input
            type="text"
            name="username"
            id="signup-username"
            ref={usernameRef}
            maxLength={USERNAME_LIMIT}
            required
          />

          {/*   E-MAIL   */}
          <label htmlFor="signup-email">E-mail: </label>
          <input
            type="email"
            name="email"
            id="signup-email"
            ref={emailRef}
            required
          />

          {/*  PASSWORD  */}
          <label htmlFor="signup-password">Password: </label>
          <PasswordInput id={"signup-password"} ref={passwordRef} />

          {/*  CONFIRM PASSWORD  */}
          <label htmlFor="signup-confirm-password">Confirm password: </label>
          <PasswordInput
            id={"signup-confirm-password"}
            ref={confirmPasswordRef}
          />

          {/*  TERMS OF SERVICE  */}
          <div id="accept-terms-container">
            <label>
              Accept{" "}
              <span className="link" onClick={() => setShowTerms(true)}>
                terms of service
              </span>
            </label>
            {/*<div className="checkbox">*/}
            <input
              id="accept-terms-checkbox"
              type="checkbox"
              ref={acceptTermsRef}
              required
            ></input>
            {/*</div>*/}
          </div>

          {/*  SUBMIT  */}
          <button type="submit">Sign Up!</button>
        </form>
      </section>
    </>
  );
};

export default SignUp;
