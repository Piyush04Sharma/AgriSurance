import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:5000';

export default function FarmerDashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ enrollments: 0, approved: 0, claims: 0, pending: 0 });
  const [recentClaims, setRecentClaims] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    Promise.all([
      axios.get(`${BASE_URL}/api/enrollments/mine`, config).catch(() => ({ data: [] })),
      axios.get(`${BASE_URL}/api/claims/myclaims`, config).catch(() => ({ data: [] })),
    ]).then(([enrRes, clmRes]) => {
      const enrs = enrRes.data;
      const clms = clmRes.data;
      setStats({
        enrollments: enrs.length,
        approved: enrs.filter(e => e.status === 'Approved').length,
        claims: clms.length,
        pending: clms.filter(c => c.status === 'Pending').length,
      });
      setRecentEnrollments(enrs.slice(0, 3));
      setRecentClaims(clms.slice(0, 3));
    }).finally(() => setLoading(false));
  }, [token]);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const NAV_CARDS = [
    { icon: '🏪', title: 'Policy Marketplace', desc: 'Browse, enroll and manage your insurance policies', path: '/my-policies', color: 'var(--green-mid)', badge: `${stats.approved} active` },
    { icon: '🚨', title: 'File a Claim',        desc: 'Report crop damage on your approved enrollments',  path: '/file-claim',  color: '#c0392b',           badge: stats.approved > 0 ? `${stats.approved} eligible` : 'Enroll first' },
    { icon: '📋', title: 'Claims History',      desc: 'Track all your submitted damage claims',           path: '/claims-history', color: '#2563eb',        badge: `${stats.claims} total` },
  ];

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <div className="dashboard-header anim-fadeUp">
        <div>
          <h1 className="dashboard-greeting">Good day, <span>{user?.name?.split(' ')[0] || 'Farmer'}</span> 🌾</h1>
          <p className="dashboard-date">{today}</p>
        </div>
        <span className="badge badge-approved" style={{ fontSize: '0.78rem', padding: '5px 12px' }}>✓ Verified Farmer</span>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { icon: '🛡️', value: stats.enrollments, label: 'My Enrollments',  color: 'green' },
          { icon: '✅', value: stats.approved,     label: 'Active Policies', color: 'green' },
          { icon: '📋', value: stats.claims,       label: 'Total Claims',    color: 'blue'  },
          { icon: '⏳', value: stats.pending,      label: 'Pending Review',  color: 'gold'  },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`} style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', margin: '2rem 0' }}>
        {NAV_CARDS.map((card, i) => (
          <div key={i} onClick={() => navigate(card.path)}
            className="anim-fadeUp"
            style={{ background: 'rgba(28,23,16,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', cursor: 'pointer', transition: 'all 0.3s ease', animationDelay: `${i * 0.1}s`, position: 'relative', overflow: 'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(201,153,58,0.3)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}>
            {/* Color accent bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: card.color, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: `${card.color}20`, border: `1px solid ${card.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                {card.icon}
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: '50px', background: 'rgba(201,153,58,0.1)', color: 'var(--gold-light)', border: '1px solid rgba(201,153,58,0.2)' }}>
                {card.badge}
              </span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--white)', marginBottom: '0.5rem' }}>{card.title}</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--earth-400)', lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
            <div style={{ marginTop: '1.25rem', fontSize: '0.82rem', color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              Open → 
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Recent Enrollments */}
        <div className="card anim-fadeUp delay-4">
          <div className="card-header">
            <span className="card-title">🛡️ Recent Enrollments</span>
            <button onClick={() => navigate('/my-policies')} style={{ fontSize: '0.75rem', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View All →</button>
          </div>
          <div className="card-body" style={{ padding: '0.75rem 1rem' }}>
            {loading ? <div style={{ height: '80px' }} className="skeleton" /> :
             recentEnrollments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--earth-500)', fontSize: '0.85rem' }}>No enrollments yet</div>
            ) : recentEnrollments.map((enr, i) => (
              <div key={enr._id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: i < recentEnrollments.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--earth-100)' }}>{enr.policy?.name || 'Policy'}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--earth-500)' }}>{enr.policy?.companyName}</div>
                </div>
                <span className={`badge badge-${enr.status?.toLowerCase() === 'approved' ? 'approved' : enr.status?.toLowerCase() === 'rejected' ? 'rejected' : 'pending'}`} style={{ fontSize: '0.65rem' }}>{enr.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Claims */}
        <div className="card anim-fadeUp delay-5">
          <div className="card-header">
            <span className="card-title">📋 Recent Claims</span>
            <button onClick={() => navigate('/claims-history')} style={{ fontSize: '0.75rem', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>View All →</button>
          </div>
          <div className="card-body" style={{ padding: '0.75rem 1rem' }}>
            {loading ? <div style={{ height: '80px' }} className="skeleton" /> :
             recentClaims.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--earth-500)', fontSize: '0.85rem' }}>No claims yet</div>
            ) : recentClaims.map((claim, i) => (
              <div key={claim._id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: i < recentClaims.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--earth-100)' }}>{claim.cropType || 'Crop'} — {claim.policy?.name || ''}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--earth-500)' }}>₹{Number(claim.estimatedLossValue || 0).toLocaleString('en-IN')} · {new Date(claim.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
                <span className={`badge badge-${claim.status?.toLowerCase() === 'approved' ? 'approved' : claim.status?.toLowerCase() === 'rejected' ? 'rejected' : 'pending'}`} style={{ fontSize: '0.65rem' }}>{claim.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}