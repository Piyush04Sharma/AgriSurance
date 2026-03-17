import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { setIsAuthenticated, setUser, setToken } = useAuth();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(''); setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); setMessage('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      const { token, name, role, _id } = response.data;
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      setUser({ name, role, _id });
      setToken(token);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb orb-1" />
      <div className="auth-bg-orb orb-2" />

      <div className="auth-card">
        {/* ── LEFT: FORM ── */}
        <div className="auth-left">
          <Link to="/" className="auth-brand-logo">
            <div className="icon">🌾</div>
            <span className="text">Agri<span>Surance</span></span>
          </Link>

          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to manage your farm insurance</p>

          {message && <div className="alert alert-success">✓ {message}</div>}
          {error   && <div className="alert alert-error">⚠ {error}</div>}

          <form className="auth-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-wrap">
                <input
                  type="email" name="email"
                  value={formData.email} onChange={onChange}
                  className="form-input" placeholder="you@example.com" required
                />
                <span className="form-input-icon">✉</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password} onChange={onChange}
                  className="form-input" placeholder="••••••••" required
                  style={{ paddingRight: '40px' }}
                />
                <span
                  className="form-input-icon"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ cursor: 'pointer' }}
                >
                  {showPassword ? '🙈' : '👁'}
                </span>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: 'rgba(0,0,0,0.8)', borderRadius: '50%', display: 'inline-block', animation: 'spinSlow 0.6s linear infinite' }} />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          <div className="auth-divider" style={{ margin: '1.25rem 0' }}>or</div>

          <p className="auth-footer-text">
            Don't have an account? <Link to="/register">Create one →</Link>
          </p>
        </div>

        {/* ── RIGHT: VISUAL ── */}
        <div className="auth-right">
          <div
            className="auth-right-image"
            style={{
              background: 'linear-gradient(135deg, #0e2017 0%, #1a3a28 40%, #0e1a0e 100%)',
            }}
          >
            {/* SVG field illustration */}
            <svg width="100%" height="100%" viewBox="0 0 500 600" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
              {/* Undulating crop rows */}
              {[0,1,2,3,4,5,6,7].map(i => (
                <g key={i} style={{ animation: `waveField ${2.5 + i * 0.3}s ease-in-out infinite`, transformOrigin: 'center' }}>
                  <path
                    d={`M-50,${100 + i * 65} Q100,${85 + i * 65} 250,${100 + i * 65} T550,${100 + i * 65}`}
                    fill="none"
                    stroke={i % 2 === 0 ? '#2d6a4f' : '#52b788'}
                    strokeWidth={i % 2 === 0 ? '3' : '1.5'}
                    opacity={0.3 + i * 0.05}
                  />
                </g>
              ))}
              {/* Sun rays */}
              <circle cx="420" cy="80" r="50" fill="rgba(201,153,58,0.08)" />
              <circle cx="420" cy="80" r="30" fill="rgba(201,153,58,0.12)" />
              {[0,45,90,135,180,225,270,315].map((angle, i) => (
                <line
                  key={i}
                  x1={420 + Math.cos(angle * Math.PI / 180) * 55}
                  y1={80 + Math.sin(angle * Math.PI / 180) * 55}
                  x2={420 + Math.cos(angle * Math.PI / 180) * 90}
                  y2={80 + Math.sin(angle * Math.PI / 180) * 90}
                  stroke="rgba(201,153,58,0.15)" strokeWidth="1.5"
                />
              ))}
            </svg>
          </div>

          <div className="auth-right-overlay" />
          <div className="auth-right-content">
            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'rgba(14,11,7,0.75)',
              backdropFilter: 'blur(16px)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(201,153,58,0.2)',
              marginBottom: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--gold-light)', margin: 0 }}>Secure & Trusted</h3>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--earth-300)', lineHeight: 1.6, margin: 0 }}>
                Your farm data and claims are protected with enterprise-grade security. Verified providers only.
              </p>
            </div>

            {/* Mini claim status preview */}
            <div style={{
              padding: '1rem 1.25rem',
              background: 'rgba(14,11,7,0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(82,183,136,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(82,183,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                ✅
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--green-accent)' }}>Claim Approved</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--earth-400)' }}>Flood Coverage · ₹45,000 disbursed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
