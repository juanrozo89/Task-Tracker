import { useEffect, useState } from "react";
import { Remarkable } from "remarkable";

const useFetchReadme = () => {
  const md = new Remarkable({ xhtmlOut: false });
  const [readmeContent, setReadmeContent] = useState<string>("");

  useEffect(() => {
    fetch("../../README.md")
      .then((response) => response.text())
      .then((data) => {
        let htmlContent = md.render(data).replace(/<h1>.*?<\/h1>/g, "");
        setReadmeContent(htmlContent);
      })
      .catch((error) => {
        console.error("Error fetching README.md:", error);
      });
  }, []);

  return readmeContent;
};

export default useFetchReadme;
