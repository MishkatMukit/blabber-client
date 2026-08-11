import React from 'react';
import Hero from '../Components/HomeComponents/Hero';
import LiveFeed from '../Components/HomeComponents/LiveFeed';
import HowItWorks from '../Components/HomeComponents/HowItWorks';
import CTASection from '../Components/HomeComponents/CTASection';

const Home = () => {
    return (
        <div>
            <Hero />
            <LiveFeed />
            <HowItWorks />
            <CTASection />
        </div>
    );
};

export default Home;
