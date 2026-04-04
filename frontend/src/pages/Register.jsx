import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { toast } from 'react-toastify';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', phone: '', address: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!formData.name.trim()) {
      e.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      e.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      e.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
      e.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      e.password = 'Password must be at least 6 characters.';
    } else if (!/[A-Z]/.test(formData.password)) {
      e.password = 'Include at least one uppercase letter.';
    } else if (!/[0-9]/.test(formData.password)) {
      e.password = 'Include at least one number.';
    }

    if (!formData.confirmPassword) {
      e.confirmPassword = 'Please confirm your password.';
    } else if (formData.confirmPassword !== formData.password) {
      e.confirmPassword = 'Passwords do not match.';
    }

    if (formData.phone && !/^\+?[0-9]{7,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      e.phone = 'Enter a valid phone number.';
    }

    return e;
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return { level: 0, label: '', color: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 2) return { level: score, label: 'Weak', color: '#e05555' };
    if (score === 3) return { level: score, label: 'Fair', color: '#f0a500' };
    if (score === 4) return { level: score, label: 'Strong', color: '#00d4aa' };
    return { level: score, label: 'Very Strong', color: '#00d4aa' };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;
      await dispatch(registerUser(payload)).unwrap();
      navigate('/dashboard');
      toast.success('Registered successfully!');
    } catch (err) {
      setServerError(err || 'Registration failed. Please try again.');
      toast.error(err || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const strength = getPasswordStrength();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        .reg-root {
          min-height: 100vh;
          margin-top: -4rem;
          background: #080a0f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .reg-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0, 212, 170, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 170, 0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
        }

        .reg-glow-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }
        .reg-glow-1 {
          width: 500px; height: 500px;
          top: -150px; left: -200px;
          background: radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%);
          animation: reg-drift 12s ease-in-out infinite alternate;
        }
        .reg-glow-2 {
          width: 400px; height: 400px;
          bottom: -100px; right: -150px;
          background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
          animation: reg-drift 16s ease-in-out infinite alternate-reverse;
        }
        @keyframes reg-drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 20px); }
        }

        .reg-card {
          width: 100%;
          max-width: 480px;
          position: relative;
          z-index: 10;
        }

        .reg-brand-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .reg-brand-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 0.5rem;
        }
        .reg-logo-icon { width: 36px; height: 36px; }
        .reg-brand-name {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #f0f2f5;
          text-transform: uppercase;
        }
        .reg-brand-name span { color: #00d4aa; }
        .reg-brand-tagline {
          font-family: 'DM Mono', monospace;
          font-size: 0.72rem;
          font-weight: 300;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-top: 0.25rem;
        }

        .reg-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,212,170,0.4), transparent);
          margin-bottom: 1.5rem;
        }

        .reg-surface {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          backdrop-filter: blur(20px);
          position: relative;
        }
        .reg-surface::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          border: 1px solid rgba(0,212,170,0.1);
          pointer-events: none;
        }

        .reg-section-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: rgba(0,212,170,0.6);
          text-transform: uppercase;
          margin-bottom: 1.75rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .reg-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        .reg-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .reg-field-group { margin-bottom: 1.1rem; }
        .reg-field-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          display: block;
          transition: color 0.2s;
        }
        .reg-field-group.focused .reg-field-label { color: rgba(0,212,170,0.8); }
        .reg-field-group.has-error .reg-field-label { color: rgba(220,80,80,0.8); }

        .reg-field-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .reg-field-icon {
          position: absolute;
          left: 14px;
          width: 16px;
          height: 16px;
          opacity: 0.3;
          transition: opacity 0.2s;
          pointer-events: none;
        }
        .reg-field-group.focused .reg-field-icon { opacity: 0.7; }

        .reg-field-input {
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
          box-sizing: border-box;
        }
        .reg-field-input::placeholder { color: rgba(255,255,255,0.15); }
        .reg-field-input:focus {
          background: rgba(0,212,170,0.04);
          border-color: rgba(0,212,170,0.35);
          box-shadow: 0 0 0 3px rgba(0,212,170,0.07), inset 0 1px 2px rgba(0,0,0,0.3);
        }
        .reg-field-group.has-error .reg-field-input {
          border-color: rgba(220,60,60,0.4);
          background: rgba(220,60,60,0.03);
        }
        .reg-field-group.has-error .reg-field-input:focus {
          box-shadow: 0 0 0 3px rgba(220,60,60,0.07);
        }

        .reg-pw-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          opacity: 0.35;
          transition: opacity 0.2s;
          display: flex;
          align-items: center;
        }
        .reg-pw-toggle:hover { opacity: 0.7; }
        .reg-field-group.focused .reg-pw-toggle { opacity: 0.6; }

        .reg-field-error {
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          color: rgba(220,100,100,0.9);
          letter-spacing: 0.04em;
          margin-top: 0.35rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .reg-field-error::before {
          content: '';
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #e05555;
          flex-shrink: 0;
        }

        /* Password strength bar */
        .reg-pw-strength {
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .reg-pw-bars {
          display: flex;
          gap: 3px;
          flex: 1;
        }
        .reg-pw-bar {
          height: 3px;
          flex: 1;
          border-radius: 2px;
          background: rgba(255,255,255,0.07);
          transition: background 0.3s;
        }
        .reg-pw-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.08em;
          min-width: 60px;
          text-align: right;
        }

        /* Server error box */
        .reg-error-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: rgba(220,60,60,0.08);
          border: 1px solid rgba(220,60,60,0.2);
          border-radius: 10px;
          padding: 0.85rem 1rem;
          margin-bottom: 1.25rem;
        }
        .reg-error-dot {
          width: 6px; height: 6px;
          background: #e05555;
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
        }
        .reg-error-text {
          font-family: 'DM Mono', monospace;
          font-size: 0.78rem;
          color: rgba(220,100,100,0.9);
          line-height: 1.5;
          letter-spacing: 0.02em;
        }

        /* Submit button */
        .reg-btn-submit {
          width: 100%;
          margin-top: 1.5rem;
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
        .reg-btn-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent 60%);
        }
        .reg-btn-submit:not(:disabled):hover {
          transform: translateY(-1px);
          opacity: 0.93;
        }
        .reg-btn-submit:not(:disabled):active {
          transform: translateY(0) scale(0.99);
        }
        .reg-btn-submit:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .reg-btn-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .reg-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(4,13,10,0.3);
          border-top-color: rgba(4,13,10,0.8);
          border-radius: 50%;
          animation: reg-spin 0.7s linear infinite;
        }
        @keyframes reg-spin { to { transform: rotate(360deg); } }

        .reg-footer {
          margin-top: 1.75rem;
          text-align: center;
          font-family: 'DM Mono', monospace;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.06em;
        }
        .reg-footer a {
          color: rgba(0,212,170,0.7);
          text-decoration: none;
          transition: color 0.2s;
        }
        .reg-footer a:hover { color: #00d4aa; }

        .reg-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .reg-status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 0.62rem;
          color: rgba(0,212,170,0.45);
          letter-spacing: 0.1em;
        }
        .reg-status-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #00d4aa;
          animation: reg-pulse 2.5s ease-in-out infinite;
        }
        @keyframes reg-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .reg-version-tag {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          color: rgba(255,255,255,0.12);
          letter-spacing: 0.1em;
        }

        @media (max-width: 500px) {
          .reg-grid-2 { grid-template-columns: 1fr; }
          .reg-surface { padding: 2rem 1.25rem; }
        }
      `}</style>

      <div className="reg-root">
        <div className="reg-glow-orb reg-glow-1" />
        <div className="reg-glow-orb reg-glow-2" />

        <div className="reg-card">
          {/* Brand */}
          <div className="reg-brand-header">
            <div className="reg-brand-logo">
              <svg className="reg-logo-icon" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="36" height="36" rx="8" fill="rgba(0,212,170,0.1)" />
                <path d="M8 22L14 10L18 18L22 14L28 22" stroke="#00d4aa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="18" cy="24" r="2.5" fill="#00d4aa" opacity="0.6" />
                <circle cx="8" cy="22" r="1.5" fill="#00d4aa" opacity="0.4" />
                <circle cx="28" cy="22" r="1.5" fill="#00d4aa" opacity="0.4" />
              </svg>
              <div>
                <div className="reg-brand-name">Intelli<span>Car</span></div>
              </div>
            </div>
            <div className="reg-brand-tagline">Fleet Intelligence Platform</div>
          </div>

          <div className="reg-divider" />

          <div className="reg-surface">
            <div className="reg-section-label">Create Account</div>

            {serverError && (
              <div className="reg-error-box">
                <div className="reg-error-dot" />
                <p className="reg-error-text">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Full Name */}
              <div className={`reg-field-group${focusedField === 'name' ? ' focused' : ''}${errors.name ? ' has-error' : ''}`}>
                <label className="reg-field-label">Full Name</label>
                <div className="reg-field-wrap">
                  <svg className="reg-field-icon" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="5" r="3" stroke="rgba(0,212,170,1)" strokeWidth="1.2" />
                    <path d="M2 14c0-3 2-5 6-5s6 2 6 5" stroke="rgba(0,212,170,1)" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    name="name"
                    className="reg-field-input"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                {errors.name && <div className="reg-field-error">{errors.name}</div>}
              </div>

              {/* Email */}
              <div className={`reg-field-group${focusedField === 'email' ? ' focused' : ''}${errors.email ? ' has-error' : ''}`}>
                <label className="reg-field-label">Email Address</label>
                <div className="reg-field-wrap">
                  <svg className="reg-field-icon" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3" width="14" height="10" rx="2" stroke="rgba(0,212,170,1)" strokeWidth="1.2" />
                    <path d="M1 6l7 4 7-4" stroke="rgba(0,212,170,1)" strokeWidth="1.2" />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    className="reg-field-input"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                {errors.email && <div className="reg-field-error">{errors.email}</div>}
              </div>

              {/* Password */}
              <div className={`reg-field-group${focusedField === 'password' ? ' focused' : ''}${errors.password ? ' has-error' : ''}`}>
                <label className="reg-field-label">Password</label>
                <div className="reg-field-wrap">
                  <svg className="reg-field-icon" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="rgba(0,212,170,1)" strokeWidth="1.2" />
                    <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="rgba(0,212,170,1)" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="8" cy="10.5" r="1" fill="rgba(0,212,170,1)" />
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="reg-field-input"
                    placeholder="Min 6 chars, 1 uppercase, 1 number"
                    style={{ paddingRight: '2.75rem' }}
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <button type="button" className="reg-pw-toggle" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
                        <circle cx="8" cy="8" r="2" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
                        <line x1="2" y1="2" x2="14" y2="14" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
                        <circle cx="8" cy="8" r="2" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Strength bar */}
                {formData.password && (
                  <div className="reg-pw-strength">
                    <div className="reg-pw-bars">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div
                          key={i}
                          className="reg-pw-bar"
                          style={{ background: i <= strength.level ? strength.color : 'rgba(255,255,255,0.07)' }}
                        />
                      ))}
                    </div>
                    <span className="reg-pw-label" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
                {errors.password && <div className="reg-field-error">{errors.password}</div>}
              </div>

              {/* Confirm Password */}
              <div className={`reg-field-group${focusedField === 'confirmPassword' ? ' focused' : ''}${errors.confirmPassword ? ' has-error' : ''}`}>
                <label className="reg-field-label">Confirm Password</label>
                <div className="reg-field-wrap">
                  <svg className="reg-field-icon" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="rgba(0,212,170,1)" strokeWidth="1.2" />
                    <path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="rgba(0,212,170,1)" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M6.5 10.5l1 1 2-2" stroke="rgba(0,212,170,1)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    className="reg-field-input"
                    placeholder="Re-enter your password"
                    style={{ paddingRight: '2.75rem' }}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <button type="button" className="reg-pw-toggle" onClick={() => setShowConfirm(p => !p)}>
                    {showConfirm ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
                        <circle cx="8" cy="8" r="2" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
                        <line x1="2" y1="2" x2="14" y2="14" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
                        <circle cx="8" cy="8" r="2" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <div className="reg-field-error">{errors.confirmPassword}</div>}
              </div>

              {/* Phone & City */}
              <div className="reg-grid-2">
                <div className={`reg-field-group${focusedField === 'phone' ? ' focused' : ''}${errors.phone ? ' has-error' : ''}`}>
                  <label className="reg-field-label">Phone <span style={{ opacity: 0.4 }}>(optional)</span></label>
                  <div className="reg-field-wrap">
                    <svg className="reg-field-icon" viewBox="0 0 16 16" fill="none">
                      <rect x="4" y="1" width="8" height="14" rx="2" stroke="rgba(0,212,170,1)" strokeWidth="1.2" />
                      <circle cx="8" cy="12" r="0.8" fill="rgba(0,212,170,1)" />
                    </svg>
                    <input
                      type="tel"
                      name="phone"
                      className="reg-field-input"
                      placeholder="9876543210"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  {errors.phone && <div className="reg-field-error">{errors.phone}</div>}
                </div>

                <div className={`reg-field-group${focusedField === 'address' ? ' focused' : ''}`}>
                  <label className="reg-field-label">City <span style={{ opacity: 0.4 }}>(optional)</span></label>
                  <div className="reg-field-wrap">
                    <svg className="reg-field-icon" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5z" stroke="rgba(0,212,170,1)" strokeWidth="1.2" />
                      <circle cx="8" cy="6" r="1.5" stroke="rgba(0,212,170,1)" strokeWidth="1.2" />
                    </svg>
                    <input
                      type="text"
                      name="address"
                      className="reg-field-input"
                      placeholder="Mumbai"
                      value={formData.address}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('address')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="reg-btn-submit">
                {isLoading ? (
                  <span className="reg-btn-loading">
                    <span className="reg-spinner" />
                    Registering
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="reg-status-bar">
              <div className="reg-status-indicator">
                <span className="reg-status-dot" />
                Secure connection
              </div>
              <div className="reg-version-tag">v2.4.1</div>
            </div>
          </div>

          <div className="reg-footer">
            Already have an account?{' '}
            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
