import { Helmet } from "react-helmet-async";
import Hero from "../../Components/HomeComponents/Hero";
import LiveFeed from "../../Components/HomeComponents/LiveFeed";
import HowItWorks from "../../Components/HomeComponents/HowItWorks";
import CTASection from "../../Components/HomeComponents/CTASection";

const Home = () => {
    return (
        <div className="pt-16">
            <Helmet><title>Blabber-Home</title></Helmet>
            <Hero />
            <LiveFeed />
            <HowItWorks />
            <CTASection />
        </div>
    );
};

export default Home;
