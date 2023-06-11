const SignUp = () => {
  return (
    <>
      <h2>Register a new account:</h2>

      <form action="" method="post">
        <label>
          Username:{" "}
          <input type="text" name="username" id="username-signup" required />
        </label>

        <label>
          Password:{" "}
          <input type="text" name="password" id="password-signup" required />
        </label>

        <label>
          Confirm password:{" "}
          <input
            type="text"
            name="confirm_password"
            id="confirm-password-signup"
            required
          />
        </label>

        <button type="submit">Sign Up!</button>
      </form>
    </>
  );
};

export default SignUp;
