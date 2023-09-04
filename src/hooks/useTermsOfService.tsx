import { useState, useEffect } from "react";

const useTermsOfService = () => {
  const [termsContent, setTermsContent] = useState<string>("");

  useEffect(() => {
    fetch("/terms-of-service.html")
      .then((response) => response.text())
      .then((data) => {
        setTermsContent(data);
      });
  }, []);

  return termsContent;
};

export default useTermsOfService;
