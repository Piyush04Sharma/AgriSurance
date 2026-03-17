import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'Farmer',
    companyName: '', licenseNumber: '',
    farmRegion: '', totalAcreage: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(''); setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setMessage('');
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'Proposer' && {
          companyName: formData.companyName,
          licenseNumber: formData.licenseNumber,
        }),
        ...(formData.role === 'Farmer' && {
          farmDetails: {
            region: formData.farmRegion,
            totalAcreage: Number(formData.totalAcreage) || 0,
          }
        }),
      };
      await axios.post('http://localhost:5000/api/auth/register', payload);
      setMessage('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFarmer = formData.role === 'Farmer';
  const isProposer = formData.role === 'Proposer';

  return (
    <div className="auth-page">
      <div className="auth-bg-orb orb-1" />
      <div className="auth-bg-orb orb-2" />

      <div className="auth-card" style={{ minHeight: '680px' }}>
        {/* ── LEFT: FORM ── */}
        <div className="auth-left" style={{ overflowY: 'auto', paddingTop: '2rem', paddingBottom: '2rem' }}>
          <Link to="/" className="auth-brand-logo">
            <div className="icon">🌾</div>
            <span className="text">Agri<span>Surance</span></span>
          </Link>

          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join the platform protecting Indian agriculture</p>

          {message && <div className="alert alert-success">✓ {message}</div>}
          {error   && <div className="alert alert-error">⚠ {error}</div>}

          <form className="auth-form" onSubmit={onSubmit}>
            {/* Role Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.25rem' }}>
              {['Farmer', 'Proposer'].map(r => (
                <button
                  key={r} type="button"
                  onClick={() => setFormData({ ...formData, role: r })}
                  style={{
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${formData.role === r ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                    background: formData.role === r ? 'rgba(201,153,58,0.15)' : 'rgba(14,11,7,0.4)',
                    color: formData.role === r ? 'var(--gold-light)' : 'var(--earth-400)',
                    font: 'inherit',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}>
                  {r === 'Farmer' ? '🚜' : '🛡️'} {r === 'Proposer' ? 'Provider' : r}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={onChange}
                className="form-input" placeholder="Rajesh Kumar" required />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={onChange}
                className="form-input" placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" value={formData.password} onChange={onChange}
                  className="form-input" placeholder="••••••••" required
                  style={{ paddingRight: '40px' }}
                />
                <span className="form-input-icon" onClick={() => setShowPassword(v => !v)} style={{ cursor: 'pointer' }}>
                  {showPassword ? '🙈' : '👁'}
                </span>
              </div>
            </div>

            {/* Farmer Fields */}
            {isFarmer && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', animation: 'fadeUp 0.3s ease both' }}>
                <div className="form-group">
                  <label className="form-label">Region / District</label>
                  <input type="text" name="farmRegion" value={formData.farmRegion} onChange={onChange}
                    className="form-input" placeholder="Punjab" />
                </div>
                <div className="form-group">
                  <label className="form-label">Farm Acreage</label>
                  <input type="number" name="totalAcreage" value={formData.totalAcreage} onChange={onChange}
                    className="form-input" placeholder="5" min="0" />
                </div>
              </div>
            )}

            {/* Proposer Fields */}
            {isProposer && (
              <div style={{ animation: 'fadeUp 0.3s ease both' }}>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={onChange}
                    className="form-input" placeholder="National Agri Insurance Ltd" required={isProposer} />
                </div>
                <div className="form-group">
                  <label className="form-label">License Number</label>
                  <input type="text" name="licenseNumber" value={formData.licenseNumber} onChange={onChange}
                    className="form-input" placeholder="IRDAI-2024-XXXXX" required={isProposer} />
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', marginTop: '0.25rem', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating Account...' : `Create ${isFarmer ? 'Farmer' : 'Provider'} Account →`}
            </button>
          </form>

          <p className="auth-footer-text" style={{ marginTop: '1rem' }}>
            Already have an account? <Link to="/login">Sign in →</Link>
          </p>
        </div>

        {/* ── RIGHT: VISUAL ── */}
        <div className="auth-right">
          <div className="auth-right-image" style={{
            background: 'linear-gradient(160deg, #0e1c14 0%, #1e3a28 50%, #0e1208 100%)',
          }}>
            <svg width="100%" height="100%" viewBox="0 0 500 600" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
              {/* Hexagonal field pattern */}
              {[...Array(20)].map((_, i) => (
                <polygon
                  key={i}
                  points="30,0 60,17 60,52 30,69 0,52 0,17"
                  fill="none"
                  stroke="#52b788"
                  strokeWidth="0.5"
                  opacity={0.3 + Math.random() * 0.3}
                  transform={`translate(${(i % 5) * 110 + (Math.floor(i/5) % 2 === 0 ? 0 : 55)}, ${Math.floor(i/5) * 75})`}
                />
              ))}
            </svg>
          </div>
          <div className="auth-right-overlay" />
          <div className="auth-right-content">
            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'rgba(14,11,7,0.8)',
              backdropFilter: 'blur(16px)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(201,153,58,0.2)',
              marginBottom: '1rem',
            }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--gold-light)', marginBottom: '0.75rem' }}>
                Why AgriSurance?
              </h3>
              {[
                { icon: '⚡', text: 'Claims processed in 48–72 hours' },
                { icon: '📸', text: 'Digital proof with camera capture' },
                { icon: '💳', text: 'Multiple payment methods' },
                { icon: '🔒', text: 'Verified insurance providers only' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '0.5rem', fontSize: '0.82rem', color: 'var(--earth-300)', alignItems: 'center' }}>
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
