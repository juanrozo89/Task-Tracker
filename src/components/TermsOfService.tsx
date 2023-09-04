import { useEffect, useState } from "react";

const TermsOfService = ({ hideFunction }: { hideFunction: AnyFunction }) => {
  const [termsContent, setTermsContent] = useState<string>("");

  useEffect(() => {
    fetch("/terms-of-service.html")
      .then((response) => response.text())
      .then((data) => {
        setTermsContent(data);
      });
  }, []);

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
