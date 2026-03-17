import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import ClaimSubmissionForm from '../components/ClaimSubmissionForm.jsx';
import PolicyEnrollmentForm from '../components/PolicyEnrollmentForm.jsx';

const COVERAGE_ICONS = { Drought: '☀️', Flood: '🌊', Pest: '🐛' };
const COVERAGE_CLASSES = { Drought: 'coverage-drought', Flood: 'coverage-flood', Pest: 'coverage-pest' };

function PolicyCard({ policy, isFavorite, onToggleFavorite, expanded, onToggleExpand, onEnroll, delay }) {
  return (
    <div
      className="policy-card"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="policy-card-header">
        <div>
          <div className="policy-company">{policy.companyName || 'Insurance Co.'}</div>
          <div className="policy-name">{policy.name}</div>
        </div>
        <button
          className="policy-fav-btn"
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(policy._id); }}
          title={isFavorite ? 'Remove from favourites' : 'Save to favourites'}
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <span className={`policy-coverage-badge ${COVERAGE_CLASSES[policy.coverageType] || ''}`}>
        {COVERAGE_ICONS[policy.coverageType] || '🛡️'} {policy.coverageType}
      </span>

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

      {/* Expand Details */}
      {expanded && (
        <div className="policy-details">
          <p>{policy.description || 'This policy provides comprehensive coverage for crop losses due to the specified natural disaster. Coverage includes assessment, documentation, and quick disbursement within 72 hours of approval.'}</p>
          <div className="policy-details-id">Policy ID: {policy._id}</div>
        </div>
      )}

      <div className="policy-card-footer">
        <button
          className="btn-secondary"
          style={{ flex: 1, padding: '0.55rem', fontSize: '0.8rem' }}
          onClick={(e) => { e.stopPropagation(); onToggleExpand(policy._id); }}
        >
          {expanded ? '▲ Less' : '▼ Details'}
        </button>
        <button
          className="btn-primary"
          style={{ flex: 1.5, padding: '0.55rem', fontSize: '0.82rem' }}
          onClick={(e) => { e.stopPropagation(); onEnroll(policy); }}
        >
          Enroll Now →
        </button>
      </div>
    </div>
  );
}

function FarmerDashboard() {
  const { token, user } = useAuth();
  const [availablePolicies, setAvailablePolicies] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPolicyId, setExpandedPolicyId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [claimForm, setClaimForm] = useState({ visible: false, selectedPolicy: null });
  const [claimFileForm, setClaimFileForm] = useState({ visible: false, selectedPolicy: null });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!token) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const load = async () => {
      try {
        const [polRes] = await Promise.all([
          axios.get('http://localhost:5000/api/policies/active', config),
        ]);
        setAvailablePolicies(polRes.data);
        // Try fetching claims
        try {
          const clRes = await axios.get('http://localhost:5000/api/claims/myclaims', config);
          setMyClaims(clRes.data);
        } catch { /* claims endpoint may not exist yet */ }
      } catch {
        // fallback: demo data
        setAvailablePolicies([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const handleApply = (policy) => setClaimForm({ visible: true, selectedPolicy: policy });
  const handleClose = () => setClaimForm({ visible: false, selectedPolicy: null });
  const handleFileClaim = (policy) => setClaimFileForm({ visible: true, selectedPolicy: policy });
  const handleCloseClaimFile = () => setClaimFileForm({ visible: false, selectedPolicy: null });

  const approvedClaims = myClaims.filter(c => c.status === 'Approved');
  const pendingClaims  = myClaims.filter(c => c.status === 'Pending');

  const filteredPolicies = availablePolicies.filter(p => {
    const matchesType = filterType === 'All' || p.coverageType === filterType;
    const matchesSearch = !searchQuery ||
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="dashboard-wrapper">
      {/* ── HEADER ── */}
      <div className="dashboard-header anim-fadeUp">
        <div>
          <h1 className="dashboard-greeting">
            Good day, <span>{user?.name?.split(' ')[0] || 'Farmer'}</span> 🌾
          </h1>
          <p className="dashboard-date">{today}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="badge badge-approved" style={{ fontSize: '0.78rem', padding: '5px 12px' }}>
            ✓ Verified Farmer
          </span>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="stats-grid">
        {[
          { icon: '📋', value: myClaims.length || 0, label: 'Total Claims', color: 'blue', delta: null },
          { icon: '✅', value: approvedClaims.length || 0, label: 'Approved Claims', color: 'green', delta: '+2 this month' },
          { icon: '⏳', value: pendingClaims.length || 0, label: 'Pending Review', color: 'gold', delta: null },
          { icon: '🛡️', value: availablePolicies.length || 0, label: 'Active Policies', color: 'green', delta: 'Available' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`} style={{ animationDelay: `${i * 0.1}s` }}>
            {s.delta && <span className="stat-delta up">{s.delta}</span>}
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── NOTIFICATIONS ── */}
      {myClaims.length > 0 && (
        <div className="card anim-fadeUp delay-4" style={{ marginBottom: '2rem' }}>
          <div className="card-header">
            <span className="card-title">🔔 Claim Updates</span>
            <span className="badge badge-pending">{myClaims.length} claims</span>
          </div>
          <div className="card-body">
            <div className="notification-list">
              {myClaims.slice(0, 4).map((claim, i) => (
                <div key={claim._id || i} className="notification-item" style={{ animationDelay: `${i * 0.1}s` }}>
                  <span className="notif-icon">
                    {claim.status === 'Approved' ? '✅' : claim.status === 'Rejected' ? '❌' : '⏳'}
                  </span>
                  <div>
                    <div className="notif-title">
                      Claim for {claim.cropType || 'Crop'} — {claim.status}
                    </div>
                    <div className="notif-time">
                      {claim.status === 'Approved'
                        ? `₹${claim.estimatedLossValue?.toLocaleString('en-IN')} approved for payout`
                        : `Submitted ${new Date(claim.createdAt).toLocaleDateString('en-IN')}`}
                    </div>
                  </div>
                  <span className={`badge badge-${claim.status?.toLowerCase()}`} style={{ marginLeft: 'auto', flexShrink: 0 }}>
                    {claim.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── POLICY MARKETPLACE ── */}
      <div className="card anim-fadeUp delay-5">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <span className="card-title">🏪 Policy Marketplace</span>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search policies..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2rem', width: '180px', height: '34px', fontSize: '0.8rem' }}
              />
              <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', opacity: 0.5 }}>🔍</span>
            </div>
            {/* Filter */}
            {['All', 'Drought', 'Flood', 'Pest'].map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '50px',
                  border: `1px solid ${filterType === f ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                  background: filterType === f ? 'rgba(201,153,58,0.15)' : 'transparent',
                  color: filterType === f ? 'var(--gold-light)' : 'var(--earth-400)',
                  font: 'inherit', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}>
                {f === 'All' ? '🛡️ All' : `${COVERAGE_ICONS[f] || ''} ${f}`}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ height: '280px', borderRadius: 'var(--radius-lg)' }} className="skeleton" />
              ))}
            </div>
          ) : filteredPolicies.length === 0 ? (
            <div className="claims-empty">
              <span className="claims-empty-icon">🌾</span>
              <p>
                {availablePolicies.length === 0
                  ? 'No active policies available from providers yet. Check back soon!'
                  : 'No policies match your search. Try different filters.'}
              </p>
            </div>
          ) : (
            <div className="policy-grid">
              {filteredPolicies.map((policy, i) => (
                <PolicyCard
                  key={policy._id}
                  policy={policy}
                  isFavorite={favorites.includes(policy._id)}
                  onToggleFavorite={id => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])}
                  expanded={expandedPolicyId === policy._id}
                  onToggleExpand={id => setExpandedPolicyId(id === expandedPolicyId ? null : id)}
                  onEnroll={handleApply}
                  delay={i * 0.08}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── MY ACTIVE CLAIMS (Enrolled Policy Claims) ── */}
      {myClaims.length > 0 && (
        <div className="card anim-fadeUp" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <span className="card-title">📋 My Claims — File &amp; Track</span>
            <span className="badge badge-pending">{myClaims.length} total</span>
          </div>
          <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {myClaims.map((claim, i) => (
              <div key={claim._id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', background: 'rgba(14,11,7,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', gap: '1rem', flexWrap: 'wrap', animation: `slideRight 0.4s ease ${i*0.08}s both` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--earth-100)', marginBottom: '3px' }}>
                    {claim.cropType || 'Crop'} — {claim.policy?.name || 'Policy'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--earth-500)' }}>
                    Est. Loss: ₹{Number(claim.estimatedLossValue || 0).toLocaleString('en-IN')} · {new Date(claim.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <span className={`badge badge-${claim.status?.toLowerCase() || 'pending'}`}>{claim.status || 'Pending'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FILE NEW CLAIM section ── */}
      {availablePolicies.length > 0 && (
        <div className="card anim-fadeUp" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <span className="card-title">🚨 File a Damage Claim</span>
          </div>
          <div style={{ padding: '1rem 1.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--earth-400)', marginBottom: '1rem', lineHeight: 1.6 }}>
              Already enrolled in a policy and suffered crop damage? Select the policy and file a claim.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {availablePolicies.map((policy, i) => (
                <div key={policy._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(14,11,7,0.4)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--earth-100)' }}>{policy.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--earth-400)' }}>{policy.companyName} · {policy.coverageType}</div>
                  </div>
                  <button
                    onClick={() => handleFileClaim(policy)}
                    style={{ padding: '0.45rem 1rem', background: 'rgba(231,76,60,0.12)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                    🚨 File Claim
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ENROLLMENT MODAL ── */}
      {claimForm.visible && claimForm.selectedPolicy && (
        <PolicyEnrollmentForm
          policy={claimForm.selectedPolicy}
          token={token}
          onClose={handleClose}
        />
      )}

      {/* ── CLAIM FILING MODAL ── */}
      {claimFileForm.visible && claimFileForm.selectedPolicy && (
        <ClaimSubmissionForm
          policy={claimFileForm.selectedPolicy}
          token={token}
          onClose={handleCloseClaimFile}
        />
      )}
    </div>
  );
}

export default FarmerDashboard;