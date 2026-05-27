import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

const COVERAGE_ICONS = { Drought: '☀️', Flood: '🌊', Pest: '🐛' };
const BASE_URL = 'http://localhost:5000';

function CreatePolicyModal({ token, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '', description: '', coverageType: 'Drought',
    premiumPrice: '', coverageAmount: '', companyName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await axios.post(`${BASE_URL}/api/policies/create`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create policy.');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', color:'var(--white)' }}>Create Policy</h2>
            <p style={{ fontSize:'0.78rem', color:'var(--earth-400)' }}>Define a new insurance plan for farmers</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error" style={{ marginBottom:'1rem' }}>⚠ {error}</div>}
          <form onSubmit={onSubmit} className="claim-form">
            <div className="form-group">
              <label className="form-label">Policy Name</label>
              <input type="text" name="name" value={formData.name} onChange={onChange} className="form-input" placeholder="e.g. Kharif Flood Protection 2025" required />
            </div>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={onChange} className="form-input" placeholder="Your Company / Insurer name" required />
            </div>
            <div className="form-group">
              <label className="form-label">Coverage Type</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'0.5rem' }}>
                {['Drought','Flood','Pest'].map(ct => (
                  <button key={ct} type="button" onClick={() => setFormData({ ...formData, coverageType: ct })}
                    style={{ padding:'0.7rem 0.5rem', borderRadius:'var(--radius-md)', border:`1px solid ${formData.coverageType===ct ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`, background: formData.coverageType===ct ? 'rgba(201,153,58,0.15)' : 'rgba(14,11,7,0.4)', color: formData.coverageType===ct ? 'var(--gold-light)' : 'var(--earth-400)', font:'inherit', fontWeight:600, fontSize:'0.82rem', cursor:'pointer', transition:'all 0.2s ease' }}>
                    {COVERAGE_ICONS[ct]} {ct}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Premium (₹)</label>
                <input type="number" name="premiumPrice" value={formData.premiumPrice} onChange={onChange} className="form-input" placeholder="1200" min="0" required />
              </div>
              <div className="form-group">
                <label className="form-label">Max Coverage (₹)</label>
                <input type="number" name="coverageAmount" value={formData.coverageAmount} onChange={onChange} className="form-input" placeholder="85000" min="0" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Policy Description</label>
              <textarea name="description" value={formData.description} onChange={onChange} className="form-input" rows="3" placeholder="Describe what this policy covers..." style={{ resize:'vertical', minHeight:'80px' }} required />
            </div>
            {formData.name && (
              <div style={{ padding:'1rem', background:'rgba(14,11,7,0.5)', borderRadius:'var(--radius-md)', border:'1px solid rgba(201,153,58,0.15)' }}>
                <div style={{ fontSize:'0.72rem', color:'var(--earth-400)', marginBottom:'6px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.5px' }}>Preview</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--white)', marginBottom:'4px' }}>{formData.name}</div>
                <div style={{ display:'flex', gap:'1rem', fontSize:'0.78rem', color:'var(--earth-400)' }}>
                  {formData.premiumPrice && <span>₹{Number(formData.premiumPrice).toLocaleString('en-IN')} premium</span>}
                  {formData.coverageAmount && <span>₹{Number(formData.coverageAmount).toLocaleString('en-IN')} max</span>}
                </div>
              </div>
            )}
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button type="button" className="btn-secondary" style={{ flex:1 }} onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ flex:2 }} disabled={loading}>
                {loading ? 'Creating...' : '✓ Create & Publish Policy'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── CLAIM IMAGE MODAL ──
function ClaimImageModal({ imageUrl, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div style={{ background:'var(--earth-800)', borderRadius:'var(--radius-lg)', overflow:'hidden', maxWidth:'700px', width:'90%', boxShadow:'var(--shadow-xl)' }}>
        <div style={{ padding:'1rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--white)' }}>Damage Proof Image</span>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        <img src={imageUrl} alt="Damage proof" style={{ width:'100%', maxHeight:'70vh', objectFit:'contain', background:'#000' }} />
      </div>
    </div>
  );
}

function ProposerDashboard() {
  const { token, user } = useAuth();
  const [pendingClaims, setPendingClaims] = useState([]);
  const [pendingEnrollments, setPendingEnrollments] = useState([]);
  const [myPolicies, setMyPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('claims');
  const [viewingImage, setViewingImage] = useState(null);

  const fetchData = async () => {
    if (!token) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const claimsRes = await axios.get(`${BASE_URL}/api/claims/pending`, config);
      setPendingClaims(claimsRes.data);
    } catch { setPendingClaims([]); }
    try {
      const enrRes = await axios.get(`${BASE_URL}/api/enrollments/pending`, config);
      setPendingEnrollments(enrRes.data);
    } catch { setPendingEnrollments([]); }
    try {
      const polRes = await axios.get(`${BASE_URL}/api/policies/mine`, config);
      setMyPolicies(polRes.data);
    } catch { setMyPolicies([]); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleUpdateClaim = async (claimId, status) => {
    setUpdatingId(claimId);
    try {
      await axios.put(`${BASE_URL}/api/claims/${claimId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingClaims(prev => prev.filter(c => c._id !== claimId));
      setSuccessMsg(`Claim ${status.toLowerCase()} successfully.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) { console.error('Update failed:', err); }
    finally { setUpdatingId(null); }
  };

  const handleUpdateEnrollment = async (enrollId, status) => {
    setUpdatingId(enrollId);
    try {
      await axios.put(`${BASE_URL}/api/enrollments/${enrollId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingEnrollments(prev => prev.filter(e => e._id !== enrollId));
      setSuccessMsg(`Enrollment ${status.toLowerCase()} successfully.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) { console.error('Enrollment update failed:', err); }
    finally { setUpdatingId(null); }
  };

  // Build correct image URL from stored path
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const cleaned = path.replace(/\\/g, '/');
    return `${BASE_URL}/${cleaned}`;
  };

  const today = new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  const TABS = [
    { id:'claims',      label:'⏳ Pending Claims',      count: pendingClaims.length },
    { id:'enrollments', label:'📋 Enrollment Requests',  count: pendingEnrollments.length },
    { id:'policies',    label:'📄 My Policies',          count: myPolicies.length },
  ];

  return (
    <div className="dashboard-wrapper">
      {/* ── HEADER ── */}
      <div className="dashboard-header anim-fadeUp">
        <div>
          <h1 className="dashboard-greeting">Provider Portal, <span>{user?.name?.split(' ')[0] || 'Proposer'}</span> 🛡️</h1>
          <p className="dashboard-date">{today}</p>
        </div>
        <button className="create-policy-btn" onClick={() => setShowCreateModal(true)}>+ Create New Policy</button>
      </div>

      {/* ── STATS ── */}
      <div className="stats-grid">
        {[
          { icon:'⏳', value: pendingClaims.length,      label:'Pending Claims',       color:'gold'  },
          { icon:'📋', value: pendingEnrollments.length, label:'Pending Enrollments',  color:'blue'  },
          { icon:'📄', value: myPolicies.length,         label:'Active Policies',      color:'green' },
          { icon:'✅', value:'—',                        label:'Approved Today',       color:'green' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`} style={{ animationDelay:`${i * 0.1}s` }}>
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {successMsg && <div className="alert alert-success anim-fadeUp" style={{ marginBottom:'1.5rem' }}>✓ {successMsg}</div>}

      {/* ── TABS ── */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding:'0.55rem 1.25rem', borderRadius:'var(--radius-sm)', border:`1px solid ${activeTab===t.id ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`, background: activeTab===t.id ? 'rgba(201,153,58,0.12)' : 'transparent', color: activeTab===t.id ? 'var(--gold-light)' : 'var(--earth-400)', font:'inherit', fontWeight:600, fontSize:'0.875rem', cursor:'pointer', transition:'all 0.2s ease', display:'flex', alignItems:'center', gap:'8px' }}>
            {t.label}
            {t.count > 0 && (
              <span style={{ width:'20px', height:'20px', borderRadius:'50%', fontSize:'0.7rem', background: activeTab===t.id ? 'var(--gold)' : 'rgba(255,255,255,0.1)', color: activeTab===t.id ? 'var(--earth-900)' : 'var(--earth-300)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── PENDING CLAIMS ── */}
      {activeTab === 'claims' && (
        <div className="card anim-fadeUp">
          <div className="card-header">
            <span className="card-title">Claims Awaiting Review</span>
            {pendingClaims.length > 0 && <span className="badge badge-pending">{pendingClaims.length} pending</span>}
          </div>
          <div className="card-body" style={{ padding:0 }}>
            {loading ? (
              <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {[1,2,3].map(i => <div key={i} style={{ height:'60px', borderRadius:'var(--radius-sm)' }} className="skeleton" />)}
              </div>
            ) : pendingClaims.length === 0 ? (
              <div className="claims-empty"><span className="claims-empty-icon">🎉</span><p>No pending claims!</p></div>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table className="claims-table">
                  <thead>
                    <tr>
                      <th>Proof</th>
                      <th>Farmer</th>
                      <th>Crop / Damage</th>
                      <th>Farm Area</th>
                      <th>Est. Loss</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingClaims.map((claim, i) => {
                      const imgUrl = getImageUrl(claim.proofImageUrl);
                      return (
                        <tr key={claim._id || i} style={{ animation:`slideRight 0.4s ease ${i * 0.06}s both` }}>
                          {/* ── PROOF IMAGE ── */}
                          <td>
                            {imgUrl ? (
                              <div onClick={() => setViewingImage(imgUrl)}
                                style={{ width:'56px', height:'56px', borderRadius:'var(--radius-sm)', overflow:'hidden', cursor:'pointer', border:'1px solid rgba(255,255,255,0.1)', flexShrink:0, position:'relative' }}>
                                <img src={imgUrl} alt="proof"
                                  style={{ width:'100%', height:'100%', objectFit:'cover' }}
                                  onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                                <div style={{ display:'none', width:'100%', height:'100%', alignItems:'center', justifyContent:'center', background:'rgba(14,11,7,0.8)', fontSize:'1.2rem', position:'absolute', top:0, left:0 }}>📷</div>
                                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0)', transition:'background 0.2s' }}
                                  onMouseEnter={e => e.currentTarget.style.background='rgba(0,0,0,0.3)'}
                                  onMouseLeave={e => e.currentTarget.style.background='rgba(0,0,0,0)'}>
                                  <span style={{ position:'absolute', bottom:'2px', right:'3px', fontSize:'0.55rem', color:'white', background:'rgba(0,0,0,0.6)', padding:'1px 4px', borderRadius:'3px' }}>view</span>
                                </div>
                              </div>
                            ) : (
                              <div style={{ width:'56px', height:'56px', borderRadius:'var(--radius-sm)', background:'rgba(255,255,255,0.04)', border:'1px dashed rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', color:'var(--earth-500)' }}>📷</div>
                            )}
                          </td>
                          {/* ── FARMER ── */}
                          <td>
                            <div style={{ fontWeight:600, color:'var(--earth-100)', fontSize:'0.85rem' }}>{claim.user?.name || '—'}</div>
                            <div style={{ fontSize:'0.7rem', color:'var(--earth-500)' }}>{claim.user?.email || ''}</div>
                          </td>
                          {/* ── CROP ── */}
                          <td>
                            <div style={{ fontWeight:600, color:'var(--earth-100)' }}>{claim.cropType || '—'}</div>
                            <div style={{ fontSize:'0.7rem', color:'var(--earth-500)', maxWidth:'140px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{claim.lossDescription || ''}</div>
                          </td>
                          <td>{claim.farmAreaAffected ? `${claim.farmAreaAffected} acres` : '—'}</td>
                          <td><span style={{ color:'var(--gold-light)', fontWeight:600 }}>{claim.estimatedLossValue ? `₹${Number(claim.estimatedLossValue).toLocaleString('en-IN')}` : '—'}</span></td>
                          <td style={{ color:'var(--earth-400)', fontSize:'0.78rem' }}>{claim.createdAt ? new Date(claim.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                          <td>
                            {updatingId === claim._id ? (
                              <div className="loading-spinner" style={{ width:'20px', height:'20px', margin:0, borderWidth:'2px' }} />
                            ) : (
                              <div style={{ display:'flex', gap:'0.5rem' }}>
                                <button className="btn-success" onClick={() => handleUpdateClaim(claim._id, 'Approved')}>✓ Approve</button>
                                <button className="btn-danger"  onClick={() => handleUpdateClaim(claim._id, 'Rejected')}>✕ Reject</button>
                              </div>
                            )}
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
      )}

      {/* ── PENDING ENROLLMENTS ── */}
      {activeTab === 'enrollments' && (
        <div className="card anim-fadeUp">
          <div className="card-header">
            <span className="card-title">Farmer Enrollment Requests</span>
            {pendingEnrollments.length > 0 && <span className="badge badge-pending">{pendingEnrollments.length} pending</span>}
          </div>
          <div className="card-body" style={{ padding:0 }}>
            {pendingEnrollments.length === 0 ? (
              <div className="claims-empty"><span className="claims-empty-icon">🎉</span><p>No pending enrollment requests!</p></div>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table className="claims-table">
                  <thead>
                    <tr>
                      <th>Farmer</th>
                      <th>Policy</th>
                      <th>Crop / Region</th>
                      <th>Farm Area</th>
                      <th>EMI Plan</th>
                      <th>Start Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingEnrollments.map((enr, i) => (
                      <tr key={enr._id || i} style={{ animation:`slideRight 0.4s ease ${i * 0.06}s both` }}>
                        <td>
                          <div style={{ fontWeight:600, color:'var(--earth-100)', fontSize:'0.85rem' }}>{enr.farmer?.name || '—'}</div>
                          <div style={{ fontSize:'0.7rem', color:'var(--earth-500)' }}>{enr.farmer?.email || ''}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight:600, color:'var(--earth-100)' }}>{enr.policy?.name || '—'}</div>
                          <div style={{ fontSize:'0.7rem', color:'var(--earth-500)' }}>{enr.policy?.coverageType}</div>
                        </td>
                        <td>
                          <div style={{ color:'var(--earth-100)' }}>{enr.cropType || '—'}</div>
                          <div style={{ fontSize:'0.7rem', color:'var(--earth-500)' }}>{enr.farmRegion || ''}</div>
                        </td>
                        <td>{enr.farmArea ? `${enr.farmArea} acres` : '—'}</td>
                        <td>
                          <span style={{ fontSize:'0.78rem', color:'var(--gold-light)', fontWeight:600, textTransform:'capitalize' }}>{enr.emiFrequency || '—'}</span>
                          <div style={{ fontSize:'0.7rem', color:'var(--earth-500)' }}>{enr.paymentMethod?.toUpperCase()}</div>
                        </td>
                        <td style={{ color:'var(--earth-400)', fontSize:'0.78rem' }}>
                          {enr.startDate ? new Date(enr.startDate).toLocaleDateString('en-IN') : '—'}
                        </td>
                        <td>
                          {updatingId === enr._id ? (
                            <div className="loading-spinner" style={{ width:'20px', height:'20px', margin:0, borderWidth:'2px' }} />
                          ) : (
                            <div style={{ display:'flex', gap:'0.5rem' }}>
                              <button className="btn-success" onClick={() => handleUpdateEnrollment(enr._id, 'Approved')}>✓ Approve</button>
                              <button className="btn-danger"  onClick={() => handleUpdateEnrollment(enr._id, 'Rejected')}>✕ Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MY POLICIES ── */}
      {activeTab === 'policies' && (
        <div className="card anim-fadeUp">
          <div className="card-header">
            <span className="card-title">Published Policies</span>
            <button className="create-policy-btn" onClick={() => setShowCreateModal(true)}>+ New Policy</button>
          </div>
          <div className="card-body" style={{ padding:0 }}>
            {myPolicies.length === 0 ? (
              <div className="claims-empty"><span className="claims-empty-icon">📝</span><p>No policies created yet!</p></div>
            ) : (
              <div style={{ overflowX:'auto' }}>
                <table className="claims-table">
                  <thead>
                    <tr>
                      <th>Policy Name</th>
                      <th>Coverage Type</th>
                      <th>Premium</th>
                      <th>Max Payout</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myPolicies.map((policy, i) => (
                      <tr key={policy._id || i} style={{ animation:`slideRight 0.4s ease ${i * 0.06}s both` }}>
                        <td>
                          <div style={{ fontWeight:600, color:'var(--earth-100)' }}>{policy.name}</div>
                          <div style={{ fontSize:'0.72rem', color:'var(--earth-500)' }}>{policy.companyName}</div>
                        </td>
                        <td>
                          <span className={`badge ${policy.coverageType==='Flood' ? 'badge-review' : policy.coverageType==='Drought' ? 'badge-pending' : 'badge-approved'}`}>
                            {COVERAGE_ICONS[policy.coverageType]} {policy.coverageType}
                          </span>
                        </td>
                        <td style={{ color:'var(--gold-light)', fontWeight:600 }}>₹{policy.premiumPrice?.toLocaleString('en-IN')}</td>
                        <td>₹{policy.coverageAmount?.toLocaleString('en-IN')}</td>
                        <td><span className="badge badge-approved">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      {showCreateModal && (
        <CreatePolicyModal token={token} onClose={() => setShowCreateModal(false)}
          onSuccess={() => { setShowCreateModal(false); fetchData(); setSuccessMsg('Policy created!'); setTimeout(() => setSuccessMsg(''), 3000); }} />
      )}

      {viewingImage && <ClaimImageModal imageUrl={viewingImage} onClose={() => setViewingImage(null)} />}
    </div>
  );
}

export default ProposerDashboard;