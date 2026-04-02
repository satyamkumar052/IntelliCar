import React from 'react';
import { Car, FileText, Bell, MapPin, MessageSquare, Wallet } from 'lucide-react';

const Ecosystem = () => {
    return (
        <section id="features" className="py-20 bg-surface-container-lowest px-6 relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b2b_1px,transparent_1px),linear-gradient(to_bottom,#161b2b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-4xl font-heading font-bold mb-4 text-white">Ecosystem Features</h2>
                    <div className="h-1 w-24 bg-primary-gradient mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                    <div className="glass-card p-6 border border-outline-variant/20 group hover:-translate-y-1 hover:border-primary/40 transition-all duration-300" data-aos="fade-up" data-aos-delay="100">
                        <div className="w-10 h-10 rounded-md bg-surface-bright flex items-center justify-center mb-5 text-primary">
                            <Car size={18} />
                        </div>
                        <h3 className="text-xl font-heading font-semibold mb-3 text-white">Car Recommendation AI</h3>
                        <p className="text-secondary text-sm leading-relaxed">Neural network analysis to find the perfect performance vehicle based on your driving profile.</p>
                    </div>

                    <div className="glass-card p-6 border border-outline-variant/20 group hover:-translate-y-1 hover:border-primary/40 transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
                        <div className="w-10 h-10 rounded-md bg-surface-bright flex items-center justify-center mb-5 text-primary">
                            <FileText size={18} />
                        </div>
                        <h3 className="text-xl font-heading font-semibold mb-3 text-white">Document Vault</h3>
                        <p className="text-secondary text-sm leading-relaxed">Encrypted storage for insurance, registration, and service history with instant retrieval.</p>
                    </div>

                    <div className="glass-card p-6 border border-outline-variant/20 group hover:-translate-y-1 hover:border-primary/40 transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
                        <div className="w-10 h-10 rounded-md bg-surface-bright flex items-center justify-center mb-5 text-primary">
                            <Bell size={18} />
                        </div>
                        <h3 className="text-xl font-heading font-semibold mb-3 text-white">Smart Reminders</h3>
                        <p className="text-secondary text-sm leading-relaxed">Proactive alerts for all challans, renewals, and regulatory compliance checks.</p>
                    </div>

                    <div className="glass-card p-6 border border-outline-variant/20 group hover:-translate-y-1 hover:border-primary/40 transition-all duration-300" data-aos="fade-up" data-aos-delay="100">
                        <div className="w-10 h-10 rounded-md bg-surface-bright flex items-center justify-center mb-5 text-primary">
                            <MapPin size={18} />
                        </div>
                        <h3 className="text-xl font-heading font-semibold mb-3 text-white">Location Finder</h3>
                        <p className="text-secondary text-sm leading-relaxed">Real-time GPS ecosystem to locate your car and nearby premium service hubs.</p>
                    </div>

                    <div className="glass-card p-6 border border-outline-variant/20 group hover:-translate-y-1 hover:border-primary/40 transition-all duration-300" data-aos="fade-up" data-aos-delay="200">
                        <div className="w-10 h-10 rounded-md bg-surface-bright flex items-center justify-center mb-5 text-primary">
                            <MessageSquare size={18} />
                        </div>
                        <h3 className="text-xl font-heading font-semibold mb-3 text-white">AI Chatbot</h3>
                        <p className="text-secondary text-sm leading-relaxed">24/7 technical assistance and concierge services powered by Large Language Models.</p>
                    </div>

                    <div className="glass-card p-6 border border-outline-variant/20 group hover:-translate-y-1 hover:border-primary/40 transition-all duration-300" data-aos="fade-up" data-aos-delay="300">
                        <div className="w-10 h-10 rounded-md bg-surface-bright flex items-center justify-center mb-5 text-primary">
                            <Wallet size={18} />
                        </div>
                        <h3 className="text-xl font-heading font-semibold mb-3 text-white">Payment Tracker</h3>
                        <p className="text-secondary text-sm leading-relaxed">Unified ledger for toll payments, fuel expenses, and maintenance costs.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Ecosystem;
