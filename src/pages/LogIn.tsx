const LogIn = () => {
  return (
    <>
      <h2>Log in to your account:</h2>

      <form action="" method="post">
        <label>
          Username:{" "}
          <input type="text" name="username" id="username-login" required />
        </label>

        <label>
          Password:{" "}
          <input type="text" name="password" id="password-login" required />
        </label>

        <button type="submit">Log In</button>
      </form>
    </>
  );
};

export default LogIn;
