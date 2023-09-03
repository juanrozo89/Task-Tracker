import { Link } from "react-router-dom";

const RedirectToLogin = () => {
  return (
    <div className="content">
      <h2 className="page-message">
        Please <Link to="/">log in</Link> or <Link to="/sign-up">sign up</Link>
      </h2>
    </div>
  );
};

export default RedirectToLogin;
