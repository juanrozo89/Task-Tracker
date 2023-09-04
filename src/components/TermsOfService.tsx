const TermsOfService = ({
  hideFunction,
  termsContent,
}: {
  hideFunction: AnyFunction;
  termsContent: string;
}) => {
  return (
    <div id="terms-of-service-container">
      <div
        id="terms-of-service"
        dangerouslySetInnerHTML={{ __html: termsContent }}
      ></div>
      <button className="" onClick={hideFunction}>
        Close
      </button>
    </div>
  );
};

export default TermsOfService;
