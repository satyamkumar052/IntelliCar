import React, { useState } from 'react';
import { Zap, Loader2, IndianRupee, Users, Gauge, Info, Fuel, Car, Target } from 'lucide-react';

const Recommendation = () => {
  const [formData, setFormData] = useState({
    purpose: 'Family',
    budget_range: 'Medium',
    fuel_type: 'Petrol',
    seatingCapacity: 5
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const purposes = [
    { value: 'Family', icon: '👨‍👩‍👧', desc: 'Spacious & safe' },
    { value: 'Commute', icon: '🏙️', desc: 'Daily driver' },
    { value: 'City', icon: '🗺️', desc: 'Urban agile' },
    { value: 'Performance', icon: '🏎️', desc: 'Speed & thrill' },
    { value: 'Offroad', icon: '🏔️', desc: 'Adventure ready' },
    { value: 'Luxury', icon: '💎', desc: 'Premium comfort' },
  ];

  const fuelTypes = [
    { value: 'Petrol', color: '#f97316', icon: '⛽' },
    { value: 'Diesel', color: '#6366f1', icon: '🛢️' },
    { value: 'CNG', color: '#22c55e', icon: '💨' },
    { value: 'Hybrid', color: '#14b8a6', icon: '⚡' },
    { value: 'Electric', color: '#3b82f6', icon: '🔋' },
  ];

  const budgetLevels = ['Low', 'Medium', 'High'];
  const budgetIndex = budgetLevels.indexOf(formData.budget_range);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    try {
      const aiUrl = import.meta.env.VITE_AI_URL || 'https://ai-wa7z.onrender.com';
      const res = await fetch(`${aiUrl}/api/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.recommendations) setResults(data.recommendations);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to ML Model. Ensure AI service is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .rec-root {
          font-family: 'DM Sans', sans-serif;
          padding: 2.5rem 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
          color: #e2e8f0;
        }

        .rec-header {
          margin-bottom: 2.5rem;
        }

        .rec-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #f97316;
          background: rgba(249,115,22,0.1);
          border: 1px solid rgba(249,115,22,0.25);
          padding: 4px 12px;
          border-radius: 99px;
          margin-bottom: 0.75rem;
        }

        .rec-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 800;
          color: #f8fafc;
          line-height: 1.1;
          margin: 0 0 0.5rem;
          letter-spacing: -0.02em;
        }

        .rec-title span {
          background: linear-gradient(135deg, #f97316, #fb923c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .rec-subtitle {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 300;
        }

        /* ── GRID ── */
        .rec-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 2rem;
          align-items: start;
        }
        @media (max-width: 860px) {
          .rec-grid { grid-template-columns: 1fr; }
        }

        /* ── FORM CARD ── */
        .form-card {
          background: rgba(15,20,30,0.75);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
        }

        .form-card::before {
          content: '';
          position: absolute;
          top: -60px;
          right: -60px;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .form-section-label {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .form-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.05);
        }

        /* ── PURPOSE GRID ── */
        .purpose-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          margin-bottom: 1.75rem;
        }

        .purpose-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 0.6rem 0.4rem;
          cursor: pointer;
          transition: all 0.18s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
        }

        .purpose-btn:hover {
          background: rgba(249,115,22,0.08);
          border-color: rgba(249,115,22,0.3);
          transform: translateY(-1px);
        }

        .purpose-btn.active {
          background: rgba(249,115,22,0.12);
          border-color: rgba(249,115,22,0.55);
          box-shadow: 0 0 16px rgba(249,115,22,0.15);
        }

        .purpose-icon {
          font-size: 1.3rem;
          line-height: 1;
        }

        .purpose-name {
          font-size: 0.65rem;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.04em;
        }

        .purpose-btn.active .purpose-name {
          color: #fb923c;
        }

        .purpose-desc {
          font-size: 0.55rem;
          color: #475569;
        }

        /* ── BUDGET TRACK ── */
        .budget-track-wrap {
          margin-bottom: 1.75rem;
          position: relative;
        }

        .budget-track-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
        }

        .budget-label {
          font-size: 0.6rem;
          color: #475569;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.15s;
        }

        .budget-label.active {
          color: #fb923c;
          font-weight: 700;
        }

        .budget-display {
          text-align: center;
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #fb923c;
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
        }

        input[type="range"].budget-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 3px;
          background: linear-gradient(
            to right,
            #f97316 0%,
            #f97316 ${(budgetIndex / 4) * 100}%,
            rgba(255,255,255,0.08) ${(budgetIndex / 4) * 100}%,
            rgba(255,255,255,0.08) 100%
          );
          border-radius: 99px;
          outline: none;
          cursor: pointer;
        }

        input[type="range"].budget-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #f97316;
          box-shadow: 0 0 0 3px rgba(249,115,22,0.25), 0 2px 8px rgba(0,0,0,0.5);
          cursor: pointer;
          transition: box-shadow 0.15s;
        }

        input[type="range"].budget-slider::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 6px rgba(249,115,22,0.2), 0 2px 8px rgba(0,0,0,0.5);
        }

        /* ── FUEL CHIPS ── */
        .fuel-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
          margin-bottom: 1.75rem;
        }

        .fuel-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0.35rem 0.75rem;
          border-radius: 99px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          font-size: 0.72rem;
          font-weight: 500;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .fuel-chip:hover {
          background: rgba(255,255,255,0.06);
          color: #e2e8f0;
        }

        .fuel-chip.active {
          color: #fff;
          font-weight: 600;
        }

        .fuel-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* ── SEAT STEPPER ── */
        .seat-stepper {
          display: flex;
          align-items: center;
          gap: 0;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1.75rem;
          width: fit-content;
        }

        .seat-btn {
          background: none;
          border: none;
          color: #94a3b8;
          width: 42px;
          height: 42px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 300;
        }

        .seat-btn:hover {
          background: rgba(249,115,22,0.1);
          color: #fb923c;
        }

        .seat-value {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #f8fafc;
          min-width: 52px;
          text-align: center;
          border-left: 1px solid rgba(255,255,255,0.07);
          border-right: 1px solid rgba(255,255,255,0.07);
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .seat-label {
          font-size: 0.6rem;
          color: #475569;
          font-weight: 400;
          letter-spacing: 0.05em;
        }

        /* ── SUBMIT BUTTON ── */
        .submit-btn {
          width: 100%;
          padding: 0.85rem 1.5rem;
          background: linear-gradient(135deg, #ea580c, #f97316);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(249,115,22,0.3);
          position: relative;
          overflow: hidden;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .submit-btn:hover::before { opacity: 1; }
        .submit-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(249,115,22,0.4); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        /* ── RESULTS ── */
        .result-empty {
          padding: 3.5rem 2rem;
          text-align: center;
          border: 1px dashed rgba(255,255,255,0.06);
          border-radius: 16px;
          color: #334155;
        }

        .result-empty-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
          opacity: 0.4;
        }

        .result-empty p {
          font-size: 0.8rem;
          font-weight: 300;
          letter-spacing: 0.03em;
        }

        /* ── RESULTS REDESIGN ── */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .result-card {
          background: rgba(12,16,24,0.7);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          margin-bottom: 1rem;
          overflow: hidden;
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
          animation: fadeInUp 0.35s ease both;
        }

        .result-card:nth-child(2) { animation-delay: 0.07s; }
        .result-card:nth-child(3) { animation-delay: 0.14s; }

        .result-card:hover {
          border-color: rgba(249,115,22,0.22);
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.35);
        }

        /* TOP HERO BAND */
        .result-hero {
          padding: 1.4rem 1.6rem 1.1rem;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1.25rem;
        }

        .result-left { flex: 1; min-width: 0; }

        .result-rank-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 0.55rem;
        }

        .result-rank-badge {
          font-family: 'Syne', sans-serif;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 7px 14px;
          border-radius: 99px;
          background: rgba(249,115,22,0.15);
          color: #fb923c;
          border: 1px solid rgba(249,115,22,0.3);
        }

        .result-rank-badge.gold   { background: rgba(250,204,21,0.12); color: #fbbf24; border-color: rgba(250,204,21,0.3); }
        .result-rank-badge.silver { background: rgba(148,163,184,0.1);  color: #94a3b8; border-color: rgba(148,163,184,0.25); }
        .result-rank-badge.bronze { background: rgba(180,120,80,0.12);  color: #cd8c52; border-color: rgba(180,120,80,0.28); }

        .result-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.45rem;
          font-weight: 800;
          color: #f8fafc;
          letter-spacing: -0.025em;
          line-height: 1.2;
          word-break: break-word;
        }

        /* SCORE DIAL */
        .result-score-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }

        .score-ring {
          position: relative;
          width: 84px;
          height: 84px;
        }

        .score-ring svg { display: block; }
        .score-ring-track { fill: none; stroke: rgba(255,255,255,0.07); stroke-width: 4.5; }
        .score-ring-fill  { fill: none; stroke: #f97316; stroke-width: 4.5; stroke-linecap: round; transition: stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1); filter: drop-shadow(0 0 5px rgba(249,115,22,0.55)); }

        .score-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1px;
        }

        .score-number {
          font-family: 'Syne', sans-serif;
          font-size: 1.2rem;
          font-weight: 800;
          color: #f8fafc;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .score-pct {
          font-size: 0.58rem;
          color: #94a3b8;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .score-label {
          font-size: 0.58rem;
          color: #f97316;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        /* STATS ROW */
        .result-stats {
          display: flex;
          gap: 0;
          border-top: 1px solid rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .result-stat {
          flex: 1;
          padding: 0.7rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 3px;
          border-right: 1px solid rgba(255,255,255,0.05);
        }

        .result-stat:last-child { border-right: none; }

        .stat-label {
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #334155;
        }

        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #e2e8f0;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .stat-value svg { opacity: 0.6; }

        /* STAR RATING */
        .stars {
          display: flex;
          gap: 2px;
          align-items: center;
        }

        .star {
          width: 9px;
          height: 9px;
          clip-path: polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
        }

        .star.full  { background: #f97316; }
        .star.half  { background: linear-gradient(90deg, #f97316 50%, rgba(255,255,255,0.08) 50%); }
        .star.empty { background: rgba(255,255,255,0.08); }

        /* REASONING */
        .result-reasoning {
          padding: 0.875rem 1.5rem 1.125rem;
          font-size: 0.78rem;
          color: #475569;
          line-height: 1.65;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .reasoning-icon {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(249,115,22,0.1);
          border: 1px solid rgba(249,115,22,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="rec-root">
        {/* Header */}
        <div className="rec-header">
          <div className="rec-badge">
            <Zap size={10} /> Smart Match Engine
          </div>
          <h1 className="rec-title">Find Your <span>Perfect Ride</span></h1>
          <p className="rec-subtitle">Powered by Scikit-learn · Random Forest classifier</p>
        </div>

        <div className="rec-grid">
          {/* ── FORM ── */}
          <div className="form-card">
            <form onSubmit={handleSubmit}>

              {/* Purpose */}
              <div className="form-section-label"><Target size={10} /> Purpose</div>
              <div className="purpose-grid">
                {purposes.map(p => (
                  <button
                    type="button"
                    key={p.value}
                    className={`purpose-btn${formData.purpose === p.value ? ' active' : ''}`}
                    onClick={() => setFormData({ ...formData, purpose: p.value })}
                  >
                    <span className="purpose-icon">{p.icon}</span>
                    <span className="purpose-name">{p.value}</span>
                    <span className="purpose-desc">{p.desc}</span>
                  </button>
                ))}
              </div>

              {/* Budget */}
              <div className="form-section-label"><IndianRupee size={10} /> Budget Range</div>
              <div className="budget-track-wrap">
                <div className="budget-display">{formData.budget_range}</div>
                <input
                  type="range"
                  title="Budget"
                  className="budget-slider"
                  min="0" max="2" step="1"
                  value={budgetIndex !== -1 ? budgetIndex : 1}
                  onChange={e => setFormData({ ...formData, budget_range: budgetLevels[+e.target.value] })}
                  style={{
                    background: `linear-gradient(to right, #f97316 0%, #f97316 ${(budgetIndex / 2) * 100}%, rgba(255,255,255,0.08) ${(budgetIndex / 2) * 100}%, rgba(255,255,255,0.08) 100%)`
                  }}
                />
                <div className="budget-track-labels">
                  {budgetLevels.map((l, i) => (
                    <span
                      key={l}
                      className={`budget-label${formData.budget_range === l ? ' active' : ''}`}
                      onClick={() => setFormData({ ...formData, budget_range: l })}
                    >
                      {i === 0 ? 'Low' : i === 1 ? 'Mid' : 'High'}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fuel */}
              <div className="form-section-label"><Fuel size={10} /> Fuel Type</div>
              <div className="fuel-chips">
                {fuelTypes.map(f => (
                  <button
                    type="button"
                    key={f.value}
                    className={`fuel-chip${formData.fuel_type === f.value ? ' active' : ''}`}
                    style={formData.fuel_type === f.value ? {
                      borderColor: f.color + '55',
                      background: f.color + '18',
                      color: f.color
                    } : {}}
                    onClick={() => setFormData({ ...formData, fuel_type: f.value })}
                  >
                    <span className="fuel-dot" style={{ background: f.color }} />
                    {f.icon} {f.value}
                  </button>
                ))}
              </div>

              {/* Seats */}
              <div className="form-section-label"><Car size={10} /> Seating Capacity</div>
              <div className="seat-stepper" style={{ marginBottom: '1.75rem' }}>
                <button
                  type="button"
                  className="seat-btn"
                  onClick={() => setFormData({ ...formData, seatingCapacity: Math.max(2, formData.seatingCapacity - 1) })}
                >−</button>
                <div className="seat-value">
                  {formData.seatingCapacity}
                  <span className="seat-label">seats</span>
                </div>
                <button
                  type="button"
                  className="seat-btn"
                  onClick={() => setFormData({ ...formData, seatingCapacity: Math.min(9, formData.seatingCapacity + 1) })}
                >+</button>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading
                  ? <><Loader2 size={16} className="spin" /> Analyzing Dataset…</>
                  : <><Gauge size={16} /> Generate Matches</>
                }
              </button>
            </form>
          </div>

          {/* ── RESULTS ── */}
          <div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#94a3b8',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#f97316',
                display: 'inline-block',
                flexShrink: 0,
                boxShadow: '0 0 6px rgba(249,115,22,0.6)'
              }} />
              Computed Matches
              <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)', display: 'block' }}/>
            </div>

            {results.length === 0 && !loading && (
              <div className="result-empty">
                <div className="result-empty-icon">🚘</div>
                <p>Set your preferences and generate AI-powered car recommendations.</p>
              </div>
            )}

            {results.map((car, index) => {
              const circumference = 2 * Math.PI * 27;
              const offset = circumference * (1 - car.confidence_score / 100);
              const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze';
              const rankLabel = index === 0 ? '#1 Best Match' : index === 1 ? '#2 Runner Up' : '#3 Alternative';
              const ringColor = index === 0 ? '#f97316' : index === 1 ? '#94a3b8' : '#cd8c52';
              const rating = typeof car.rating === 'number' ? car.rating : parseFloat(car.rating) || 4.0;
              const fullStars = Math.floor(rating);
              const hasHalf = (rating % 1) >= 0.5;
              return (
                <div key={index} className="result-card" style={{ animationDelay: `${index * 0.07}s` }}>

                  {/* HERO */}
                  <div className="result-hero">
                    <div className="result-left">
                      <div className="result-rank-row">
                        <span className={`result-rank-badge ${rankClass}`}>{rankLabel}</span>
                      </div>
                      <div className="result-name">{car.brand} {car.model}</div>
                    </div>

                    {/* SCORE RING */}
                    <div className="result-score-wrap">
                      <div className="score-ring">
                        <svg viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                          <circle className="score-ring-track" cx="32" cy="32" r="27"/>
                          <circle
                            className="score-ring-fill"
                            cx="32" cy="32" r="27"
                            style={{
                              strokeDasharray: circumference,
                              strokeDashoffset: offset,
                              stroke: ringColor
                            }}
                          />
                        </svg>
                        <div className="score-center">
                          <span className="score-number">{Math.round(car.confidence_score)}<sup style={{ fontSize: '0.55rem', fontWeight: 600, color: '#94a3b8', verticalAlign: 'super', marginLeft: 1 }}>%</sup></span>
                          <span className="score-pct">match</span>
                        </div>
                      </div>
                      <span className="score-label">Score</span>
                    </div>
                  </div>

                  {/* STATS ROW */}
                  <div className="result-stats">
                    <div className="result-stat">
                      <span className="stat-label">Price</span>
                      <span className="stat-value">
                        <IndianRupee size={12}/>{(car.price_inr / 100000).toFixed(2)} L
                      </span>
                    </div>
                    <div className="result-stat">
                      <span className="stat-label">Rating</span>
                      <span className="stat-value" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                        <span>{rating.toFixed(1)} / 5</span>
                        <div className="stars">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={`star ${i < fullStars ? 'full' : (i === fullStars && hasHalf) ? 'half' : 'empty'}`}/>
                          ))}
                        </div>
                      </span>
                    </div>
                    <div className="result-stat">
                      <span className="stat-label">Fuel</span>
                      <span className="stat-value" style={{ fontSize: '0.78rem' }}>
                        {car.fuel_type || formData.fuel_type}
                      </span>
                    </div>
                    <div className="result-stat">
                      <span className="stat-label">Segment</span>
                      <span className="stat-value" style={{ fontSize: '0.78rem' }}>
                        {car.segment || formData.purpose}
                      </span>
                    </div>
                  </div>

                  {/* REASONING */}
                  <div className="result-reasoning">
                    <div className="reasoning-icon">
                      <Info size={10} style={{ color: '#f97316' }}/>
                    </div>
                    <span>{car.reasoning}</span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Recommendation;
