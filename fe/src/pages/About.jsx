import Hero from "../components/about/Hero";
import Maps from "../components/about/Maps";
import Team from "../components/about/Team";
import PageHeaders from "../components/PageHeaders";

const About = () => {
  return (
    <div className="grid grid-cols-1">
      <PageHeaders curPage="About" />
      <Hero />
      <Maps />
      <Team />
    </div>
  );
};

export default About;
