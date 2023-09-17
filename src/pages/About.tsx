import ContactInfo from "../components/ContactInfo";

interface AboutProps {
  content: string;
}

const About: React.FC<AboutProps> = ({ content }) => {
  return (
    <section id="about" className="content">
      <div id="readme" dangerouslySetInnerHTML={{ __html: content }}></div>
      <ContactInfo />
    </section>
  );
};

export default About;
