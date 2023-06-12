const SignUp = () => {
  return (
    <>
      <h2>Register a new account:</h2>

      <form action="" method="post">
        <label htmlFor="username-signup">Username: </label>
        <input type="text" name="username" id="username-signup" required />

        <label htmlFor="password-signup">Password: </label>
        <input type="text" name="password" id="password-signup" required />

        <label htmlFor="confirm-password-signup">Confirm password: </label>
        <input
          type="text"
          name="confirm_password"
          id="confirm-password-signup"
          required
        />

        <button type="submit">Sign Up!</button>
      </form>
    </>
  );
};

export default SignUp;
