const LogIn = () => {
  return (
    <section id="log-in" className="content">
      <h2>Log in to your account:</h2>

      <form action="" method="post">
        <label htmlFor="username-login">Username: </label>
        <input type="text" name="username" id="username-login" required />

        <label htmlFor="password-login">Password: </label>
        <input type="password" name="password" id="password-login" required />

        <button type="submit">Log In</button>
      </form>
    </section>
  );
};

export default LogIn;
