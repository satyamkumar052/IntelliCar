import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Share2 } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative bg-[#050b14] pt-20 pb-8 overflow-hidden z-10">
            {/* Top glowing line effect */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#0d1526]"></div>
            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/80 to-transparent shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-12 lg:gap-16 border-b border-white/5 pb-12 mb-8" data-aos="fade-up">
                    {/* Brand Column */}
                    <div>
                        <h3 className="text-white text-2xl font-black italic mb-6 tracking-wide">
                            IntelliCar
                        </h3>
                        <p className="text-[#8a9bbf] text-[13px] leading-relaxed mb-8 max-w-[280px]">
                            Defining the digital frontier for the modern motorist. High-fidelity management for high-performance lives.
                        </p>
                        <div className="flex gap-3">
                            <button className="w-8 h-8 rounded-md bg-[#131824] border border-white/5 flex items-center justify-center text-[#8a9bbf] hover:text-white hover:bg-white/5 transition-colors">
                                <Globe size={14} />
                            </button>
                            <button className="w-8 h-8 rounded-md bg-[#131824] border border-white/5 flex items-center justify-center text-[#8a9bbf] hover:text-white hover:bg-white/5 transition-colors">
                                <Share2 size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Ecosystem Column */}
                    <div>
                        <h4 className="text-white text-[11px] font-bold tracking-[0.15em] uppercase mb-6">
                            Ecosystem
                        </h4>
                        <ul className="flex flex-col gap-4">
                            <li><Link to="#" className="text-[#8a9bbf] hover:text-white text-[13px] transition-colors">Global Fleet</Link></li>
                            <li><Link to="#" className="text-[#8a9bbf] hover:text-white text-[13px] transition-colors">AI Advisor</Link></li>
                            <li><Link to="#" className="text-[#8a9bbf] hover:text-white text-[13px] transition-colors">Secure Vault</Link></li>
                            <li><Link to="#" className="text-[#8a9bbf] hover:text-white text-[13px] transition-colors">Carbon Neutrality</Link></li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="text-white text-[11px] font-bold tracking-[0.15em] uppercase mb-6">
                            Legal
                        </h4>
                        <ul className="flex flex-col gap-4">
                            <li><Link to="#" className="text-[#8a9bbf] hover:text-white text-[13px] transition-colors">Privacy Policy</Link></li>
                            <li><Link to="#" className="text-[#8a9bbf] hover:text-white text-[13px] transition-colors">Terms of Service</Link></li>
                            <li><Link to="#" className="text-[#8a9bbf] hover:text-white text-[13px] transition-colors">Compliance</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h4 className="text-white text-[11px] font-bold tracking-[0.15em] uppercase mb-6">
                            Newsletter
                        </h4>
                        <p className="text-[#8a9bbf] text-[12px] mb-6">
                            Subscribe for deep-drive updates.
                        </p>
                        <form className="flex relative" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-transparent border-none border-b border-white/10 pb-3 pr-8 text-white text-[13px] focus:outline-none focus:border-blue-500 transition-colors placeholder:text-[#4a5568]"
                            />
                            <button type="submit" className="absolute right-0 top-[40%] -translate-y-1/2 bg-transparent border-none text-white hover:text-blue-400 transition-colors">
                                <ArrowRight size={16} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Copyright */}
                <div className="text-center" data-aos="fade-up" data-aos-delay="100">
                    <p className="text-[#4a5568] text-[9px] sm:text-[10px] tracking-[0.15em] m-0">
                        © 2024 INTELLICAR SYSTEMS. ENGINEERED FOR THE INFINITE ROAD.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
