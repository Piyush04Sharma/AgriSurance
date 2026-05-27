import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:5000';

export default function ClientsList() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState('All');
  const [policies, setPolicies] = useState([]);

  useEffect(() => {
    if (!token) return;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    Promise.all([
      axios.get(`${BASE_URL}/api/enrollments/clients`, config).catch(() => ({ data: [] })),
      axios.get(`${BASE_URL}/api/policies/mine`, config).catch(() => ({ data: [] })),
    ]).then(([enrRes, polRes]) => {
      setEnrollments(enrRes.data);
      setPolicies(polRes.data);
    }).finally(() => setLoading(false));
  }, [token]);

  const filtered = enrollments.filter(e => {
    const matchStatus  = filterStatus === 'All' || e.status === filterStatus;
    const matchPolicy  = selectedPolicy === 'All' || (e.policy?._id === selectedPolicy || e.policy === selectedPolicy);
    const matchSearch  = !searchQuery ||
      e.farmer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.farmer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.cropType?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchPolicy && matchSearch;
  });

  const approved = enrollments.filter(e => e.status === 'Approved');
  const pending  = enrollments.filter(e => e.status === 'Pending');

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <div className="dashboard-header anim-fadeUp">
        <div>
          <h1 className="dashboard-greeting">My <span>Clients</span> 👨‍🌾</h1>
          <p className="dashboard-date">All farmers enrolled in your insurance policies</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary"
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { icon: '👨‍🌾', value: enrollments.length, label: 'Total Clients',      color: 'blue'  },
          { icon: '✅', value: approved.length,       label: 'Active Clients',    color: 'green' },
          { icon: '⏳', value: pending.length,        label: 'Pending Approval',  color: 'gold'  },
          { icon: '📄', value: policies.length,       label: 'My Policies',       color: 'green' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.color}`} style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="stat-icon">{s.icon}</span>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <input type="text" placeholder="Search farmer name, email..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)} className="form-input"
            style={{ paddingLeft: '2rem', width: '220px', height: '36px', fontSize: '0.85rem' }} />
          <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
        </div>

        {/* Status filter */}
        {['All', 'Approved', 'Pending', 'Rejected'].map(f => (
          <button key={f} onClick={() => setFilterStatus(f)}
            style={{ padding: '0.35rem 0.85rem', borderRadius: '50px', border: `1px solid ${filterStatus === f ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`, background: filterStatus === f ? 'rgba(201,153,58,0.15)' : 'transparent', color: filterStatus === f ? 'var(--gold-light)' : 'var(--earth-400)', font: 'inherit', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            {f}
          </button>
        ))}

        {/* Policy filter */}
        {policies.length > 0 && (
          <select value={selectedPolicy} onChange={e => setSelectedPolicy(e.target.value)}
            className="form-input" style={{ height: '36px', fontSize: '0.82rem', paddingTop: 0, paddingBottom: 0, background: 'rgba(14,11,7,0.5)', color: 'var(--earth-200)', width: 'auto', minWidth: '180px' }}>
            <option value="All">All Policies</option>
            {policies.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        )}
      </div>

      {/* Clients Table */}
      <div className="card anim-fadeUp">
        <div className="card-header">
          <span className="card-title">👨‍🌾 Enrolled Farmers</span>
          <span className="badge badge-pending">{filtered.length} clients</span>
        </div>
        <div style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[1,2,3].map(i => <div key={i} style={{ height: '70px', borderRadius: 'var(--radius-md)' }} className="skeleton" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="claims-empty">
              <span className="claims-empty-icon">👨‍🌾</span>
              <p>{enrollments.length === 0 ? 'No farmers enrolled yet.' : 'No clients match your search.'}</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="claims-table">
                <thead>
                  <tr>
                    <th>Farmer</th>
                    <th>Policy</th>
                    <th>Crop / Region</th>
                    <th>Farm Area</th>
                    <th>EMI Plan</th>
                    <th>Enrolled On</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((enr, i) => (
                    <tr key={enr._id || i} style={{ animation: `slideRight 0.4s ease ${i * 0.06}s both` }}>
                      <td>
                        {/* Farmer avatar + name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--green-mid), var(--gold))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                            {enr.farmer?.name?.[0]?.toUpperCase() || 'F'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--earth-100)', fontSize: '0.875rem' }}>{enr.farmer?.name || '—'}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--earth-500)' }}>{enr.farmer?.email || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--earth-100)', fontSize: '0.85rem' }}>{enr.policy?.name || '—'}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--earth-500)' }}>{enr.policy?.coverageType}</div>
                      </td>
                      <td>
                        <div style={{ color: 'var(--earth-100)', fontSize: '0.85rem' }}>{enr.cropType || '—'}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--earth-500)' }}>📍 {enr.farmRegion || '—'}</div>
                      </td>
                      <td style={{ color: 'var(--earth-200)' }}>{enr.farmArea ? `${enr.farmArea} acres` : '—'}</td>
                      <td>
                        <div style={{ fontSize: '0.82rem', color: 'var(--gold-light)', fontWeight: 600, textTransform: 'capitalize' }}>{enr.emiFrequency || '—'}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--earth-500)' }}>{enr.paymentMethod?.toUpperCase()}</div>
                      </td>
                      <td style={{ color: 'var(--earth-400)', fontSize: '0.78rem' }}>
                        {enr.createdAt ? new Date(enr.createdAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td>
                        <span className={`badge badge-${enr.status?.toLowerCase() === 'approved' ? 'approved' : enr.status?.toLowerCase() === 'rejected' ? 'rejected' : 'pending'}`}>
                          {enr.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}