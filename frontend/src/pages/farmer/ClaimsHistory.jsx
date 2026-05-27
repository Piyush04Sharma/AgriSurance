import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:5000';

export default function ClaimsHistory() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewingImage, setViewingImage] = useState(null);

  useEffect(() => {
    if (!token) return;
    axios.get(`${BASE_URL}/api/claims/myclaims`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setClaims(res.data))
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
  }, [token]);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${BASE_URL}/${path.replace(/\\/g, '/')}`;
  };

  const filtered = filterStatus === 'All' ? claims : claims.filter(c => c.status === filterStatus);
  const approved = claims.filter(c => c.status === 'Approved');
  const pending  = claims.filter(c => c.status === 'Pending');
  const rejected = claims.filter(c => c.status === 'Rejected');

  const STATUS_FILTERS = ['All', 'Pending', 'Approved', 'Rejected'];

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <div className="dashboard-header anim-fadeUp">
        <div>
          <h1 className="dashboard-greeting">Claims <span>History</span> 📋</h1>
          <p className="dashboard-date">Track all your submitted damage claims</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary"
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { icon: '📋', value: claims.length,    label: 'Total Claims',    color: 'blue'  },
          { icon: '⏳', value: pending.length,   label: 'Under Review',    color: 'gold'  },
          { icon: '✅', value: approved.length,  label: 'Approved',        color: 'green' },
          { icon: '❌', value: rejected.length,  label: 'Rejected',        color: 'red'   },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`} style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {STATUS_FILTERS.map(f => (
          <button key={f} onClick={() => setFilterStatus(f)}
            style={{ padding: '0.45rem 1rem', borderRadius: '50px', border: `1px solid ${filterStatus === f ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`, background: filterStatus === f ? 'rgba(201,153,58,0.15)' : 'transparent', color: filterStatus === f ? 'var(--gold-light)' : 'var(--earth-400)', font: 'inherit', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            {f === 'All' ? `All (${claims.length})` : f === 'Pending' ? `⏳ Pending (${pending.length})` : f === 'Approved' ? `✅ Approved (${approved.length})` : `❌ Rejected (${rejected.length})`}
          </button>
        ))}
      </div>

      {/* Claims list */}
      <div className="card anim-fadeUp">
        <div className="card-header">
          <span className="card-title">📋 {filterStatus === 'All' ? 'All Claims' : `${filterStatus} Claims`}</span>
          <span className="badge badge-pending">{filtered.length} records</span>
        </div>
        <div style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1,2,3].map(i => <div key={i} style={{ height: '80px', borderRadius: 'var(--radius-md)' }} className="skeleton" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="claims-empty">
              <span className="claims-empty-icon">📋</span>
              <p>{claims.length === 0 ? 'No claims submitted yet.' : `No ${filterStatus.toLowerCase()} claims.`}</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="claims-table">
                <thead>
                  <tr>
                    <th>Proof</th>
                    <th>Policy</th>
                    <th>Crop / Damage</th>
                    <th>Area Affected</th>
                    <th>Est. Loss</th>
                    <th>Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((claim, i) => {
                    const imgUrl = getImageUrl(claim.proofImageUrl);
                    return (
                      <tr key={claim._id || i} style={{ animation: `slideRight 0.4s ease ${i * 0.06}s both` }}>
                        <td>
                          {imgUrl ? (
                            <div onClick={() => setViewingImage(imgUrl)}
                              style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
                              <img src={imgUrl} alt="proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={e => { e.target.style.display = 'none'; }} />
                            </div>
                          ) : (
                            <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📷</div>
                          )}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--earth-100)', fontSize: '0.85rem' }}>{claim.policy?.name || '—'}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--earth-500)' }}>{claim.policy?.companyName || ''}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--earth-100)' }}>{claim.cropType || '—'}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--earth-500)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{claim.lossDescription || ''}</div>
                        </td>
                        <td>{claim.farmAreaAffected ? `${claim.farmAreaAffected} acres` : '—'}</td>
                        <td><span style={{ color: 'var(--gold-light)', fontWeight: 600 }}>₹{Number(claim.estimatedLossValue || 0).toLocaleString('en-IN')}</span></td>
                        <td style={{ color: 'var(--earth-400)', fontSize: '0.78rem' }}>{claim.createdAt ? new Date(claim.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                        <td>
                          <span className={`badge badge-${claim.status?.toLowerCase() === 'approved' ? 'approved' : claim.status?.toLowerCase() === 'rejected' ? 'rejected' : 'pending'}`}>
                            {claim.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Image viewer modal */}
      {viewingImage && (
        <div className="modal-overlay" onClick={() => setViewingImage(null)}>
          <div style={{ background: 'var(--earth-800)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', maxWidth: '700px', width: '90%' }}>
            <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--white)' }}>Damage Proof</span>
              <button className="modal-close-btn" onClick={() => setViewingImage(null)}>✕</button>
            </div>
            <img src={viewingImage} alt="proof" style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', background: '#000' }} />
          </div>
        </div>
      )}
    </div>
  );
}