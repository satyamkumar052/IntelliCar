import React from 'react';

const Journey = () => {
    return (
        <section id="technology" className="py-20 bg-surface px-6 relative mb-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-start justify-between gap-6 mb-12" data-aos="fade-up">
                    <div>
                        <h2 className="text-4xl font-heading font-bold mb-3 text-white">Journey to Intelligence</h2>
                        <p className="text-secondary text-sm md:text-base">Four simple steps to digitize your automotive lifecycle.</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="glass-card p-6 border border-outline-variant/20 hover:-translate-y-1 hover:border-primary/40 transition-all duration-300" data-aos="fade-up" data-aos-delay="100">
                        <h3 className="text-2xl font-heading font-semibold text-white mb-3">Register</h3>
                        <p className="text-secondary text-sm leading-relaxed">Create your premium account and set up your biometric security profile.</p>
                    </div>

                    <div className="glass-card p-6 border border-outline-variant/20 hover:-translate-y-1 hover:border-primary/40 transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
                        <h3 className="text-2xl font-heading font-semibold text-white mb-3">Add Your Car</h3>
                        <p className="text-secondary text-sm leading-relaxed">Input VIN or scan your plate. Our AI fetches technical specifications automatically.</p>
                    </div>

                    <div className="glass-card p-6 border border-outline-variant/20 hover:-translate-y-1 hover:border-primary/40 transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
                        <h3 className="text-2xl font-heading font-semibold text-white mb-3">Upload Documents</h3>
                        <p className="text-secondary text-sm leading-relaxed">Securely vault your insurance and registration docs using military-grade encryption.</p>
                    </div>

                    <div className="glass-card p-6 border border-outline-variant/20 hover:-translate-y-1 hover:border-primary/40 transition-all duration-300" data-aos="fade-up" data-aos-delay="400">
                        <h3 className="text-2xl font-heading font-semibold text-white mb-3">Get Smart Alerts</h3>
                        <p className="text-secondary text-sm leading-relaxed">Relax as IntelliCar monitors renewals, services, and car health for you.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Journey;
