import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import carImage from '../../assets/image.png';

const Hero = () => {
    return (
        <section className="relative pt-20 pb-20 lg:pt-28 lg:pb-32 px-6">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2" data-aos="fade-right">
                    <h1 className="text-5xl lg:text-7xl font-bold font-heading leading-tight mb-6 mt-4">
                        Own Smarter. <br />
                        <span className="text-transparent bg-clip-text bg-primary-gradient">Drive Confident.</span>
                    </h1>
                    <p className="text-xl text-secondary mb-8 max-w-lg leading-relaxed">
                        The premium digital ecosystem for high-performance ownership intelligence. AI-driven insights, document vaults, and proactive reminders in one seamless cockpit
                    </p>
                    <div className="flex gap-4">
                        <Link to="/register" className="btn-primary flex items-center gap-2">
                            Start Engine <ChevronRight size={18} />
                        </Link>
                        <Link to="/login" className="btn-secondary">
                            Access System
                        </Link>
                    </div>
                </div>

                <div className="lg:w-1/2 w-full mt-12 lg:mt-0" data-aos="zoom-in" data-aos-delay="200">
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden glass-card border border-outline-variant/10 shadow-glow">
                        <img
                            src={carImage}
                            alt="Sports car"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface/50 via-transparent to-surface/20"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
