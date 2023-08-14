const InternalError = () => {
  return (
    <div id="internal-error-page" className="content">
      <h2>
        <span className="error-status">500: </span>Internal Error
      </h2>
      <p>
        Sorry, we couldn't establish a connection to the database. Please try
        again later.
      </p>
    </div>
  );
};

export default InternalError;
