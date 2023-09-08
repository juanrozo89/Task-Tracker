const InternalError: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div id="internal-error-page" className="content">
      <h2>
        <span className="error-status">500: </span>Internal Error
      </h2>
      <p>{message}</p>
    </div>
  );
};

export default InternalError;
