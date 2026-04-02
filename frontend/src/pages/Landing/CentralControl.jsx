import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Fuel, Shield, CheckCircle2, ChevronRight } from 'lucide-react';

const CentralControl = () => {
    return (
        <section 
            style={{
                background: "#0d1117",
                padding: "80px 24px",
            }}
        >
            <div className="pt-10"
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 56,
                    alignItems: "center",
                }}
            >
                {/* LEFT: Dashboard Card */}
                <div style={{ perspective: "1000px" }}>
                    <div
                        style={{
                            background: "#222737",
                            borderRadius: 20,
                            border: "1px solid rgba(255,255,255,0.07)",
                            padding: "28px 28px 24px",
                            boxShadow: "0 0 60px rgba(59,130,246,0.08)",
                            transform: "rotateY(-15deg) rotateX(4deg)",
                            transformStyle: "preserve-3d",
                        }}
                    >
                        {/* Card Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                            <div>
                                <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, margin: 0 }}>Vehicle Status</p>
                                <p style={{ color: "#4a5568", fontSize: 11, margin: "4px 0 0", letterSpacing: "0.05em" }}>
                                    MODEL S PLAID • 2024
                                </p>
                            </div>
                            <MoreVertical size={16} color="#4a5568" />
                        </div>

                        {/* Circular Progress Rings */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                            {/* Insurance Ring */}
                            <div
                                style={{
                                    borderRadius: 14,
                                    border: "1px solid rgba(255, 0, 0, 0.06)",
                                    padding: "36px 16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 16,
                                }}
                            >
                                <div style={{ position: "relative", width: 100, height: 100 }}>
                                    <svg width="100" height="100" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                                        <circle
                                            cx="50" cy="50" r="38" fill="none"
                                            stroke="#7c9ef5" strokeWidth="6"
                                            strokeDasharray={2 * Math.PI * 38}
                                            strokeDashoffset={2 * Math.PI * 38 * (1 - 0.80)}
                                            strokeLinecap="round"
                                            transform="rotate(-90 50 50)"
                                        />
                                    </svg>
                                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>80%</span>
                                    </div>
                                </div>
                                <span style={{ color: "#6b7a99", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                                    Insurance
                                </span>
                            </div>

                            {/* PUC Renewal Ring */}
                            <div
                                style={{
                                    borderRadius: 14,
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    padding: "36px 16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 16,
                                }}
                            >
                                <div style={{ position: "relative", width: 100, height: 100 }}>
                                    <svg width="100" height="100" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                                        <circle
                                            cx="50" cy="50" r="38" fill="none"
                                            stroke="#f4a5a5" strokeWidth="6"
                                            strokeDasharray={2 * Math.PI * 38}
                                            strokeDashoffset={2 * Math.PI * 38 * (1 - 0.30)}
                                            strokeLinecap="round"
                                            transform="rotate(-90 50 50)"
                                        />
                                    </svg>
                                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>30%</span>
                                    </div>
                                </div>
                                <span style={{ color: "#6b7a99", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                                    PUC Renewal
                                </span>
                            </div>
                        </div>

                        {/* Status Rows */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div
                                style={{
                                    background: "#1A1F2F",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: 12,
                                    padding: "16px 20px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <Fuel size={16} color="#7c9ef5" />
                                    <span style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>Next Oil Service</span>
                                </div>
                                <span style={{ color: "#4a5568", fontSize: 13 }}>1,200 km left</span>
                            </div>
                            <div
                                style={{
                                    background: "#1A1F2F",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: 12,
                                    padding: "16px 20px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <Shield size={16} color="#7c9ef5" />
                                    <span style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>Secure Vault</span>
                                </div>
                                <span style={{ color: "#4a5568", fontSize: 13 }}>4 Docs Verified</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Text Content */}
                <div>
                    <h2
                        style={{
                            color: "#fff",
                            fontSize: 44,
                            fontWeight: 800,
                            lineHeight: 1.15,
                            margin: "0 0 20px",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        The Central Control For Your Drive.
                    </h2>
                    <p
                        style={{
                            color: "#8a9bbf",
                            fontSize: 15,
                            lineHeight: 1.75,
                            margin: "0 0 32px",
                            maxWidth: 460,
                        }}
                    >
                        Experience a cockpit designed for precision. Our intuitive dashboard gives you high-fidelity
                        insights into your vehicle&apos;s health, compliance status, and maintenance roadmap.
                    </p>

                    {/* Feature List */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 36 }}>
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <CheckCircle2 size={18} color="#3b82f6" style={{ marginTop: 2, flexShrink: 0 }} />
                            <div>
                                <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>
                                    Real-time Telemetry Integration
                                </p>
                                <p style={{ color: "#6b7a99", fontSize: 13, margin: 0 }}>
                                    Sync with your car&apos;s OBD-II for live health stats.
                                </p>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <CheckCircle2 size={18} color="#3b82f6" style={{ marginTop: 2, flexShrink: 0 }} />
                            <div>
                                <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, margin: "0 0 4px" }}>
                                    Automated Compliance Monitoring
                                </p>
                                <p style={{ color: "#6b7a99", fontSize: 13, margin: 0 }}>
                                    Never miss an insurance or PUC renewal again.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                        to="/dashboard"
                        style={{
                            background: "#2563eb",
                            color: "#fff",
                            borderRadius: 8,
                            padding: "14px 28px",
                            fontSize: 13,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            textDecoration: "none",
                            textTransform: "uppercase",
                        }}
                    >
                        EXPERIENCE DASHBOARD <ChevronRight size={15} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CentralControl;
