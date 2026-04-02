import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await dispatch(loginUser({ email: formData.email, password: formData.password })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      setError(err || 'Authentication error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        .login-root {
          min-height: 100vh;
          margin-top: -7rem;
          background: #080a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Animated grid background */
        .login-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0, 212, 170, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 170, 0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
        }

        /* Ambient glow orbs */
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }
        .glow-orb-1 {
          width: 500px; height: 500px;
          top: -150px; left: -200px;
          background: radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%);
          animation: drift 12s ease-in-out infinite alternate;
        }
        .glow-orb-2 {
          width: 400px; height: 400px;
          bottom: -100px; right: -150px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          animation: drift 16s ease-in-out infinite alternate-reverse;
        }
        @keyframes drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 20px); }
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 10;
        }

        /* Brand header */
        .brand-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .brand-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 0.5rem;
        }
        .logo-icon {
          width: 36px;
          height: 36px;
        }
        .brand-name {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #f0f2f5;
          text-transform: uppercase;
        }
        .brand-name span {
          color: #00d4aa;
        }
        .brand-tagline {
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          font-weight: 300;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-top: 0.25rem;
        }

        /* Divider line with glow */
        .divider-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,212,170,0.4), transparent);
          margin-bottom: 1.5rem;
        }

        /* Form card surface */
        .form-surface {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          backdrop-filter: blur(20px);
          position: relative;
        }
        .form-surface::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          border: 1px solid rgba(0,212,170,0.1);
          pointer-events: none;
        }

        /* Section label */
        .section-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: rgba(0,212,170,0.6);
          text-transform: uppercase;
          margin-bottom: 1.75rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        /* Form fields */
        .field-group {
          margin-bottom: 1.25rem;
        }
        .field-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          display: block;
          transition: color 0.2s;
        }
        .field-group.focused .field-label {
          color: rgba(0,212,170,0.8);
        }

        .field-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .field-icon {
          position: absolute;
          left: 14px;
          width: 16px;
          height: 16px;
          opacity: 0.3;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        .field-group.focused .field-icon {
          opacity: 0.7;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.85rem;
          font-weight: 400;
          color: rgba(255,255,255,0.85);
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          letter-spacing: 0.04em;
        }
        .field-input::placeholder {
          color: rgba(255,255,255,0.15);
        }
        .field-input:focus {
          background: rgba(0,212,170,0.04);
          border-color: rgba(0,212,170,0.35);
          box-shadow: 0 0 0 3px rgba(0,212,170,0.07), inset 0 1px 2px rgba(0,0,0,0.3);
        }

        /* Error state */
        .error-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: rgba(220,60,60,0.08);
          border: 1px solid rgba(220,60,60,0.2);
          border-radius: 10px;
          padding: 0.85rem 1rem;
          margin-bottom: 1.25rem;
        }
        .error-dot {
          width: 6px;
          height: 6px;
          background: #e05555;
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
        }
        .error-text {
          font-family: 'DM Mono', monospace;
          font-size: 0.78rem;
          color: rgba(220,100,100,0.9);
          line-height: 1.5;
          letter-spacing: 0.02em;
        }

        /* Submit button */
        .btn-submit {
          width: 100%;
          margin-top: 1.75rem;
          padding: 0.85rem 1rem;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          position: relative;
          overflow: hidden;
          transition: opacity 0.2s, transform 0.15s;
          background: linear-gradient(135deg, #00d4aa 0%, #00b892 50%, #00a37f 100%);
          color: #040d0a;
        }
        .btn-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent 60%);
        }
        .btn-submit:not(:disabled):hover {
          transform: translateY(-1px);
          opacity: 0.93;
        }
        .btn-submit:not(:disabled):active {
          transform: translateY(0) scale(0.99);
        }
        .btn-submit:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(4,13,10,0.3);
          border-top-color: rgba(4,13,10,0.8);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Footer */
        .form-footer {
          margin-top: 1.75rem;
          text-align: center;
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.06em;
        }
        .form-footer a {
          color: rgba(0,212,170,0.7);
          text-decoration: none;
          transition: color 0.2s;
        }
        .form-footer a:hover {
          color: #00d4aa;
        }

        /* Status bar at bottom of card */
        .status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          color: rgba(0,212,170,0.45);
          letter-spacing: 0.1em;
        }
        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #00d4aa;
          animation: pulse 2.5s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .version-tag {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          color: rgba(255,255,255,0.12);
          letter-spacing: 0.1em;
        }
      `}</style>

      <div className="login-root">
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />

        <div className="login-card">
          {/* Brand */}
          <div className="brand-header">
            <div className="brand-logo">
              <svg className="logo-icon" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="8" fill="rgba(0,212,170,0.1)" />
                <path d="M8 22L14 10L18 18L22 14L28 22" stroke="#00d4aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="18" cy="24" r="2.5" fill="#00d4aa" opacity="0.6" />
                <circle cx="8" cy="22" r="1.5" fill="#00d4aa" opacity="0.4" />
                <circle cx="28" cy="22" r="1.5" fill="#00d4aa" opacity="0.4" />
              </svg>
              <div>
                <div className="brand-name">Intelli<span>Car</span></div>
              </div>
            </div>
            <div className="brand-tagline">Fleet Intelligence Platform</div>
          </div>

          <div className="divider-line" />

          {/* Form surface */}
          <div className="form-surface">
            <div className="section-label">Sign In</div>

            {error && (
              <div className="error-box">
                <div className="error-dot" />
                <p className="error-text">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={`field-group${focusedField === 'email' ? ' focused' : ''}`}>
                <label className="field-label">Email ID</label>
                <div className="field-wrap">
                  <svg className="field-icon" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3" width="14" height="10" rx="2" stroke="rgba(0,212,170,1)" strokeWidth="1.2" />
                    <path d="M1 6l7 4 7-4" stroke="rgba(0,212,170,1)" strokeWidth="1.2" />
                  </svg>
                  <input
                    type="email"
                    required
                    className="field-input"
                    placeholder="[EMAIL_ADDRESS]"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              <div className={`field-group${focusedField === 'password' ? ' focused' : ''}`}>
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <svg className="field-icon" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="rgba(0,212,170,1)" strokeWidth="1.2" />
                    <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="rgba(0,212,170,1)" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="8" cy="10.5" r="1" fill="rgba(0,212,170,1)" />
                  </svg>
                  <input
                    type="password"
                    required
                    className="field-input"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-submit">
                {isLoading ? (
                  <span className="btn-loading">
                    <span className="spinner" />
                    Authenticating
                  </span>
                ) : (
                  'Initialize Connection'
                )}
              </button>
            </form>

            <div className="status-bar">
              <div className="status-indicator">
                <span className="status-dot" />
                Secure connection
              </div>
              <div className="version-tag">v2.4.1</div>
            </div>
          </div>

          <div className="form-footer">
            Don't have an account?{' '}
            <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;