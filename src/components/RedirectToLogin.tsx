import { Link } from "react-router-dom";

const RedirectToLogin = () => {
  return (
    <div className="content">
      <h3 style={{ marginTop: "20vh" }}>
        Please <Link to="/">log in</Link> or <Link to="/sign-up">sign up</Link>
      </h3>
    </div>
  );
};

export default RedirectToLogin;
