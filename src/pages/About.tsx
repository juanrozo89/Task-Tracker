import { useEffect, useState } from "react";
import { Remarkable } from "remarkable";
import ContactInfo from "../components/ContactInfo";

const About = () => {
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

  return (
    <section id="about" className="content">
      {/*<p>
        TaskTrack is a simple intuitive app designed to streamline your daily
        achievements and help you stay on top of your tasks.
      </p>
      <p>
        It combines the functionality of a comprehensive to-do list with an
        efficient task manager and tracker, empowering you to optimize your
        time, achieve your goals, and stay organized.
  </p>*/}
      <div
        id="readme"
        dangerouslySetInnerHTML={{ __html: readmeContent }}
      ></div>
      <ContactInfo />
    </section>
  );
};

export default About;
