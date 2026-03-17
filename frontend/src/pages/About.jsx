import React from 'react';
import { Link } from 'react-router-dom';

const ROLES = [
  {
    icon: '🚜',
    title: 'Farmer',
    color: 'var(--green-mid)',
    desc: 'Browse insurance policies, submit claims with digital proof including camera-captured land images, track payout status in real time, and receive disbursements directly.',
    features: ['Policy Marketplace', 'Camera Land Capture', 'Real-time Claim Tracking', 'Instant Payouts'],
  },
  {
    icon: '🛡️',
    title: 'Insurance Provider',
    color: 'var(--gold)',
    desc: 'Create and publish customizable insurance plans, review farmer claims with supporting evidence, approve or reject with one click, and manage your entire portfolio.',
    features: ['Policy Management', 'Claims Review Dashboard', 'One-Click Approval', 'Analytics & Reports'],
  },
  {
    icon: '⚙️',
    title: 'Administrator',
    color: '#4a90e2',
    desc: 'Full platform access for oversight, user management, dispute resolution, and compliance monitoring across all farmers and insurance providers.',
    features: ['User Management', 'Dispute Resolution', 'Compliance Monitoring', 'Full Analytics'],
  },
];

const TECH = [
  { icon: '⚛️', label: 'React 19', desc: 'Lightning-fast UI' },
  { icon: '🟢', label: 'Node.js', desc: 'Scalable backend' },
  { icon: '🍃', label: 'MongoDB', desc: 'Flexible database' },
  { icon: '🔐', label: 'JWT Auth', desc: 'Secure sessions' },
  { icon: '📸', label: 'Camera API', desc: 'Land capture' },
  { icon: '💳', label: 'Payment Gateway', desc: 'UPI · Card · NetBank' },
];

function About() {
  return (
    <div>
      {/* ── HERO ── */}
      <div className="about-hero">
        <div className="section-label" style={{ textAlign: 'center', display: 'block' }}>About the Platform</div>
        <h1 className="hero-title anim-fadeUp" style={{ textAlign: 'center', maxWidth: '700px', margin: '0.75rem auto 1.25rem' }}>
          India's Most <span className="accent">Transparent</span><br />Crop Insurance Platform
        </h1>
        <p className="hero-desc anim-fadeUp delay-2" style={{ textAlign: 'center', maxWidth: '560px', margin: '0 auto 2.5rem' }}>
          AgriSurance bridges the gap between farmers and insurance providers through digital innovation —
          from AI-assisted land measurement to instant claim processing.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }} className="anim-fadeUp delay-3">
          <Link to="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '0.85rem 2rem', borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Get Started →
          </Link>
          <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none', padding: '0.85rem 2rem', borderRadius: 'var(--radius-md)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Sign In
          </Link>
        </div>
      </div>

      {/* ── ROLES ── */}
      <section style={{ padding: '0 5vw 5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="section-label">User Roles</div>
          <h2 className="section-title">Who Uses <span className="accent">AgriSurance?</span></h2>
        </div>
        <div className="about-grid">
          {ROLES.map((role, i) => (
            <div key={i} className="about-role-card" style={{ animationDelay: `${i * 0.15}s` }}>
              <span className="about-role-icon">{role.icon}</span>
              <h3 className="about-role-title" style={{ color: role.color }}>{role.title}</h3>
              <p className="about-role-desc" style={{ marginBottom: '1.25rem' }}>{role.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {role.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--earth-300)' }}>
                    <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: `${role.color}20`, border: `1px solid ${role.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: role.color, flexShrink: 0 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TECHNOLOGY ── */}
      <section style={{
        padding: '4rem 5vw',
        background: 'rgba(14,11,7,0.5)',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label">Built With</div>
          <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>Modern <span className="accent">Technology Stack</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
            {TECH.map((t, i) => (
              <div key={i} style={{
                padding: '1.5rem 1rem',
                background: 'rgba(28,23,16,0.8)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'default',
                animation: `fadeUp 0.5s ease ${i * 0.08}s both`,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,153,58,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{t.icon}</div>
                <div style={{ fontWeight: 700, color: 'var(--earth-100)', fontSize: '0.9rem', marginBottom: '2px' }}>{t.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--earth-500)' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section style={{ padding: '5rem 5vw', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌾</div>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>Our <span className="accent">Mission</span></h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--earth-300)', lineHeight: 1.8 }}>
            To empower every Indian farmer with accessible, transparent, and fast crop insurance —
            eliminating bureaucratic delays and ensuring that when nature strikes,
            financial support arrives within days, not months.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
