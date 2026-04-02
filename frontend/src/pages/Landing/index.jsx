import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Hero from './Hero';
import Ecosystem from './Ecosystem';
import Journey from './Journey';
import CentralControl from './CentralControl';
import AIFleet from './AIFleet';
import Footer from './Footer';

const Landing = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <div className="min-h-screen bg-surface overflow-hidden">
            <Hero />
            <Ecosystem />
            <Journey />
            <CentralControl />
            <AIFleet />
            <Footer />
        </div>
    );
};

export default Landing;
