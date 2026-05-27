import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import PolicyEnrollmentForm from '../../components/PolicyEnrollmentForm.jsx';

const COVERAGE_ICONS = { Drought: '☀️', Flood: '🌊', Pest: '🐛' };
const COVERAGE_CLASSES = { Drought: 'coverage-drought', Flood: 'coverage-flood', Pest: 'coverage-pest' };
const BASE_URL = 'http://localhost:5000';

export default function MyPolicies() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [availablePolicies, setAvailablePolicies] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('favPolicies') || '[]'); } catch { return []; }
  });
  const [activeTab, setActiveTab] = useState('all');
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [enrollForm, setEnrollForm] = useState({ visible: false, selectedPolicy: null });
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!token) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    Promise.all([
      axios.get(`${BASE_URL}/api/policies/active`, config),
      axios.get(`${BASE_URL}/api/enrollments/mine`, config).catch(() => ({ data: [] })),
    ]).then(([polRes, enrRes]) => {
      setAvailablePolicies(polRes.data);
      setMyEnrollments(enrRes.data);
    }).finally(() => setLoading(false));
  }, [token]);

  const enrollmentMap = myEnrollments.reduce((acc, enr) => {
    const id = enr.policy?._id || enr.policy;
    acc[id] = enr.status;
    return acc;
  }, {});

  const toggleFav = (id) => {
    const updated = favorites.includes(id) ? favorites.filter(x => x !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('favPolicies', JSON.stringify(updated));
  };

  const favPolicies = availablePolicies.filter(p => favorites.includes(p._id));
  const enrolledPolicies = availablePolicies.filter(p => enrollmentMap[p._id]);

  const displayPolicies = (activeTab === 'favourites' ? favPolicies : activeTab === 'enrolled' ? enrolledPolicies : availablePolicies)
    .filter(p => (filterType === 'All' || p.coverageType === filterType) &&
      (!searchQuery || p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.companyName?.toLowerCase().includes(searchQuery.toLowerCase())));

  const TABS = [
    { id: 'all',        label: '🏪 All Policies',    count: availablePolicies.length },
    { id: 'enrolled',   label: '✅ My Enrollments',   count: enrolledPolicies.length },
    { id: 'favourites', label: '❤️ Favourites',       count: favPolicies.length },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header anim-fadeUp">
        <div>
          <h1 className="dashboard-greeting">My <span>Policies</span> 🛡️</h1>
          <p className="dashboard-date">Browse, enroll and manage your insurance policies</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { icon: '🏪', value: availablePolicies.length, label: 'Available Policies', color: 'blue' },
          { icon: '✅', value: enrolledPolicies.length,  label: 'My Enrollments',     color: 'green' },
          { icon: '⏳', value: myEnrollments.filter(e => e.status === 'Pending').length, label: 'Pending Approval', color: 'gold' },
          { icon: '❤️', value: favPolicies.length,       label: 'Favourites',         color: 'green' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`} style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: '0.55rem 1.25rem', borderRadius: 'var(--radius-sm)', border: `1px solid ${activeTab === t.id ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`, background: activeTab === t.id ? 'rgba(201,153,58,0.12)' : 'transparent', color: activeTab === t.id ? 'var(--gold-light)' : 'var(--earth-400)', font: 'inherit', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {t.label}
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', fontSize: '0.7rem', background: activeTab === t.id ? 'var(--gold)' : 'rgba(255,255,255,0.1)', color: activeTab === t.id ? 'var(--earth-900)' : 'var(--earth-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <input type="text" placeholder="Search policies..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="form-input" style={{ paddingLeft: '2rem', width: '200px', height: '36px', fontSize: '0.85rem' }} />
          <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
        </div>
        {['All', 'Drought', 'Flood', 'Pest'].map(f => (
          <button key={f} onClick={() => setFilterType(f)} style={{ padding: '0.35rem 0.85rem', borderRadius: '50px', border: `1px solid ${filterType === f ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`, background: filterType === f ? 'rgba(201,153,58,0.15)' : 'transparent', color: filterType === f ? 'var(--gold-light)' : 'var(--earth-400)', font: 'inherit', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            {f === 'All' ? '🛡️ All' : `${COVERAGE_ICONS[f]} ${f}`}
          </button>
        ))}
      </div>

      {/* Empty favourites message */}
      {activeTab === 'favourites' && favPolicies.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--earth-500)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤍</div>
          <p>No favourite policies yet. Click the heart icon on any policy to save it here.</p>
        </div>
      )}

      {/* Policy Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[1,2,3].map(i => <div key={i} style={{ height: '280px', borderRadius: 'var(--radius-lg)' }} className="skeleton" />)}
        </div>
      ) : (
        <div className="policy-grid">
          {displayPolicies.map((policy, i) => {
            const enrollStatus = enrollmentMap[policy._id];
            const isFav = favorites.includes(policy._id);
            return (
              <div key={policy._id} className="policy-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="policy-card-header">
                  <div>
                    <div className="policy-company">{policy.companyName}</div>
                    <div className="policy-name">{policy.name}</div>
                  </div>
                  <button className="policy-fav-btn" onClick={() => toggleFav(policy._id)} title={isFav ? 'Remove from favourites' : 'Add to favourites'}>
                    {isFav ? '❤️' : '🤍'}
                  </button>
                </div>

                <span className={`policy-coverage-badge ${COVERAGE_CLASSES[policy.coverageType] || ''}`}>
                  {COVERAGE_ICONS[policy.coverageType] || '🛡️'} {policy.coverageType}
                </span>

                {enrollStatus && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.75rem', background: enrollStatus === 'Approved' ? 'rgba(82,183,136,0.12)' : 'rgba(201,153,58,0.1)', color: enrollStatus === 'Approved' ? 'var(--green-accent)' : 'var(--gold-light)', border: `1px solid ${enrollStatus === 'Approved' ? 'rgba(82,183,136,0.25)' : 'rgba(201,153,58,0.2)'}` }}>
                    {enrollStatus === 'Approved' ? '✓ Enrolled & Active' : enrollStatus === 'Pending' ? '⏳ Pending Approval' : '✕ Rejected'}
                  </div>
                )}

                <div className="policy-stats">
                  <div className="policy-stat-item">
                    <span className="policy-stat-value">₹{(policy.premiumPrice || 0).toLocaleString('en-IN')}</span>
                    <span className="policy-stat-label">Premium / Season</span>
                  </div>
                  <div className="policy-stat-item">
                    <span className="policy-stat-value">₹{(policy.coverageAmount || 0).toLocaleString('en-IN')}</span>
                    <span className="policy-stat-label">Max Payout</span>
                  </div>
                </div>

                {expandedId === policy._id && (
                  <div className="policy-details">
                    <p>{policy.description || 'Comprehensive coverage for crop losses.'}</p>
                    <div className="policy-details-id">Policy ID: {policy._id}</div>
                  </div>
                )}

                <div className="policy-card-footer">
                  <button className="btn-secondary" style={{ flex: 1, padding: '0.55rem', fontSize: '0.8rem' }}
                    onClick={() => setExpandedId(expandedId === policy._id ? null : policy._id)}>
                    {expandedId === policy._id ? '▲ Less' : '▼ Details'}
                  </button>
                  {!enrollStatus ? (
                    <button className="btn-primary" style={{ flex: 1.5, padding: '0.55rem', fontSize: '0.82rem' }}
                      onClick={() => setEnrollForm({ visible: true, selectedPolicy: policy })}>
                      Enroll Now →
                    </button>
                  ) : (
                    <button disabled style={{ flex: 1.5, padding: '0.55rem', fontSize: '0.82rem', background: 'rgba(255,255,255,0.05)', color: 'var(--earth-400)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', cursor: 'not-allowed' }}>
                      {enrollStatus === 'Approved' ? '✓ Enrolled' : enrollStatus === 'Pending' ? '⏳ Pending' : '✕ Rejected'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {enrollForm.visible && enrollForm.selectedPolicy && (
        <PolicyEnrollmentForm policy={enrollForm.selectedPolicy} token={token}
          onClose={() => setEnrollForm({ visible: false, selectedPolicy: null })} />
      )}
    </div>
  );
}