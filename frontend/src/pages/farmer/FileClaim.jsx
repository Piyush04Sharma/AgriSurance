import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import ClaimSubmissionForm from '../../components/ClaimSubmissionForm.jsx';

const BASE_URL = 'http://localhost:5000';

export default function FileClaim() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [approvedEnrollments, setApprovedEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimForm, setClaimForm] = useState({ visible: false, selectedPolicy: null });

  useEffect(() => {
    if (!token) return;
    axios.get(`${BASE_URL}/api/enrollments/mine`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setApprovedEnrollments(res.data.filter(e => e.status === 'Approved')))
      .catch(() => setApprovedEnrollments([]))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <div className="dashboard-header anim-fadeUp">
        <div>
          <h1 className="dashboard-greeting">File a <span>Damage Claim</span> 🚨</h1>
          <p className="dashboard-date">Report crop damage on your enrolled policies</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary"
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Info box */}
      <div style={{ padding: '1rem 1.25rem', background: 'rgba(201,153,58,0.07)', border: '1px solid rgba(201,153,58,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>ℹ️</span>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--gold-light)', marginBottom: '4px' }}>How it works</div>
          <p style={{ fontSize: '0.82rem', color: 'var(--earth-300)', lineHeight: 1.7, margin: 0 }}>
            You can only file claims on policies where your enrollment has been <strong style={{ color: 'var(--green-accent)' }}>approved</strong> by the insurance provider.
            After submitting, your provider will review your claim within 48–72 hours.
            If approved, the payout will be sent to your registered account.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[1,2].map(i => <div key={i} style={{ height: '80px', borderRadius: 'var(--radius-md)' }} className="skeleton" />)}
        </div>
      ) : approvedEnrollments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛡️</div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--white)', marginBottom: '0.75rem' }}>No Approved Enrollments</h3>
          <p style={{ color: 'var(--earth-400)', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            You need to first enroll in a policy and get it approved by the provider before you can file a damage claim.
          </p>
          <button onClick={() => navigate('/my-policies')} className="btn-primary"
            style={{ padding: '0.75rem 2rem', borderRadius: 'var(--radius-md)' }}>
            Browse Policies →
          </button>
        </div>
      ) : (
        <div className="card anim-fadeUp">
          <div className="card-header">
            <span className="card-title">🚨 Select Policy to Claim Against</span>
            <span className="badge badge-approved">{approvedEnrollments.length} eligible</span>
          </div>
          <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {approvedEnrollments.map((enr, i) => (
              <div key={enr._id || i}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', background: 'rgba(14,11,7,0.5)', border: '1px solid rgba(82,183,136,0.2)', borderRadius: 'var(--radius-lg)', gap: '1rem', flexWrap: 'wrap', transition: 'all 0.2s', animation: `fadeUp 0.4s ease ${i * 0.1}s both` }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(82,183,136,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(82,183,136,0.2)'}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.5rem' }}>
                      {enr.policy?.coverageType === 'Flood' ? '🌊' : enr.policy?.coverageType === 'Drought' ? '☀️' : '🐛'}
                    </span>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--white)' }}>{enr.policy?.name || 'Policy'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--earth-400)' }}>{enr.policy?.companyName}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {[
                      { label: 'Coverage', value: enr.policy?.coverageType },
                      { label: 'Max Payout', value: `₹${enr.policy?.coverageAmount?.toLocaleString('en-IN')}` },
                      { label: 'Your Crop', value: enr.cropType },
                      { label: 'Farm Area', value: `${enr.farmArea} acres` },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--earth-500)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--earth-200)' }}>{value || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setClaimForm({ visible: true, selectedPolicy: enr.policy })}
                  style={{ padding: '0.65rem 1.5rem', background: 'rgba(231,76,60,0.15)', color: '#e74c3c', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(231,76,60,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(231,76,60,0.15)'; }}>
                  🚨 File Claim
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {claimForm.visible && claimForm.selectedPolicy && (
        <ClaimSubmissionForm policy={claimForm.selectedPolicy} token={token}
          onClose={() => setClaimForm({ visible: false, selectedPolicy: null })} />
      )}
    </div>
  );
}