import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, Zap, Leaf, Car, ChevronRight } from 'lucide-react';

const AIFleet = () => {
    const [drivingStyle, setDrivingStyle] = useState("dynamic");
    const [annualKm, setAnnualKm] = useState(25000);
    const [analyzing, setAnalyzing] = useState(false);
    const [analyzed, setAnalyzed] = useState(false); // To handle styles from Landing.jsx
    
    const navigate = useNavigate();

    const handleAnalyze = () => {
        setAnalyzing(true);
        setTimeout(() => {
            navigate("/recommend");
        }, 1200);
    };

    return (
        <section
            style={{
                background: "linear-gradient(160deg, #0d1117 0%, #111827 60%, #0d1117 100%)",
                padding: "80px 32px",
                position: "relative",
                overflow: "hidden",
            }}
            data-aos="fade-up"
        >
            {/* Background glows */}
            <div style={{
                position: "absolute",
                top: "40%",
                left: "30%",
                transform: "translate(-50%, -50%)",
                width: 800,
                height: 800,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />
            <div style={{
                position: "absolute",
                top: "60%",
                right: "10%",
                width: 400,
                height: 400,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(124,158,245,0.06) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
                {/* Section Header */}
                <div style={{ marginBottom: 40 }} data-aos="fade-up">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <div style={{
                            background: "rgba(59,130,246,0.12)",
                            border: "1px solid rgba(59,130,246,0.2)",
                            borderRadius: 8,
                            padding: "7px 14px",
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                        }}>
                            <SlidersHorizontal size={15} color="#3b82f6" />
                            <span style={{ color: "#3b82f6", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>AI Powered</span>
                        </div>
                    </div>
                    <h2 style={{
                        color: "#fff",
                        fontSize: 38,
                        fontWeight: 800,
                        lineHeight: 1.15,
                        margin: "0 0 12px",
                        letterSpacing: "-0.02em",
                    }}>AI Fleet Advisor</h2>
                    <p style={{ color: "#8a9bbf", fontSize: 14, maxWidth: 480, lineHeight: 1.7, margin: 0 }}>
                        Input your driving DNA. Our AI finds the car that fits your future.
                    </p>
                </div>

                {/* Main Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 48,
                    alignItems: "center",
                }}>
                    {/* LEFT: Controls */}
                    <div data-aos="fade-right" data-aos-delay="100" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        {/* Driving Style Toggle */}
                        <div style={{ marginBottom: 24 }}>
                            <p style={{
                                color: "#6b7a99",
                                fontSize: 10,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                margin: "0 0 10px",
                                fontWeight: 600,
                            }}>Driving Style</p>
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 14,
                                overflow: "hidden",
                                background: "#131925",
                            }}>
                                {[
                                    { key: "dynamic", label: "Dynamic Performance", icon: <Zap size={13} /> },
                                    { key: "eco", label: "Sustainable Range", icon: <Leaf size={13} /> },
                                    { key: "luxury", label: "Luxury Cruise", icon: <Car size={13} /> },
                                ].map((opt) => (
                                    <button
                                        key={opt.key}
                                        onClick={() => { setDrivingStyle(opt.key); setAnalyzed(false); }}
                                        style={{
                                            padding: "13px 10px",
                                            border: "none",
                                            cursor: "pointer",
                                            background: drivingStyle === opt.key
                                                ? "linear-gradient(135deg, #1d4ed8, #3b82f6)"
                                                : "transparent",
                                            color: drivingStyle === opt.key ? "#fff" : "#6b7a99",
                                            fontSize: 11,
                                            fontWeight: 600,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            gap: 5,
                                            transition: "all 0.25s ease",
                                            borderRight: "1px solid rgba(255,255,255,0.06)",
                                        }}
                                    >
                                        {opt.icon}
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Annual KM Slider */}
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                <p style={{
                                    color: "#6b7a99",
                                    fontSize: 10,
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    margin: 0,
                                    fontWeight: 600,
                                }}>Annual Kilometers</p>
                                <span style={{
                                    color: "#3b82f6",
                                    fontSize: 13,
                                    fontWeight: 700,
                                }}>
                                    {annualKm.toLocaleString()} km
                                </span>
                            </div>
                            <input
                                type="range"
                                min={5000}
                                max={100000}
                                step={1000}
                                value={annualKm}
                                onChange={(e) => { setAnnualKm(Number(e.target.value)); setAnalyzed(false); }}
                                style={{
                                    width: "100%",
                                    accentColor: "#3b82f6",
                                    cursor: "pointer",
                                    height: 4,
                                }}
                            />
                            <div style={{ display: "flex", justifyItems: "space-between", marginTop: 10 }}>
                                <span style={{ color: "#3a4560", fontSize: 11, marginRight: "auto" }}>5,000 km</span>
                                <span style={{ color: "#3a4560", fontSize: 11 }}>100,000 km</span>
                            </div>
                        </div>

                        {/* Analyze Button */}
                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            style={{
                                width: "100%",
                                padding: "14px 24px",
                                background: analyzing
                                    ? "rgba(59,130,246,0.3)"
                                    : "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                                border: "none",
                                borderRadius: 10,
                                color: "#fff",
                                fontSize: 13,
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                cursor: analyzing ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 8,
                                transition: "all 0.3s ease",
                                boxShadow: analyzing ? "none" : "0 4px 20px rgba(59,130,246,0.3)",
                            }}
                        >
                            {analyzing ? (
                                <>
                                    <span style={{
                                        width: 14,
                                        height: 14,
                                        border: "2px solid rgba(255,255,255,0.3)",
                                        borderTop: "2px solid #fff",
                                        borderRadius: "50%",
                                        display: "inline-block",
                                        animation: "spin 0.8s linear infinite",
                                    }} />
                                    Analyzing Matches...
                                </>
                            ) : (
                                <>Analyze Matches <ChevronRight size={15} /></>
                            )}
                        </button>
                    </div>

                    {/* RIGHT: Match Result Card */}
                    <div data-aos="fade-left" data-aos-delay="200">
                        <div style={{
                            width: "100%",
                            background: "#1a2035",
                            borderRadius: 18,
                            border: "1px solid rgba(255,255,255,0.07)",
                            overflow: "hidden",
                            boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
                        }}>
                            {/* Car Image */}
                            <div style={{ position: "relative", height: 220, overflow: "hidden", background: "#0d1117" }}>
                                <img
                                    src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80"
                                    alt="Matched Car"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                                {analyzing && (
                                    <div style={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: "rgba(13,17,23,0.5)",
                                    }}>
                                        <div style={{
                                            width: 36,
                                            height: 36,
                                            border: "3px solid rgba(59,130,246,0.25)",
                                            borderTop: "3px solid #3b82f6",
                                            borderRadius: "50%",
                                            animation: "spin 0.8s linear infinite",
                                        }} />
                                    </div>
                                )}
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: "20px 24px 24px", textAlign: "center" }}>
                                <p style={{ color: "#3a4560", fontSize: 13, margin: 0 }}>
                                    {analyzing ? "Scanning fleet database..." : "Your perfect match will appear here"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spinner keyframe */}
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </section>
    );
};

export default AIFleet;
