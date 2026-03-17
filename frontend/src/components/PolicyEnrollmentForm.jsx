// PolicyEnrollmentForm.jsx
// Step 1 of the insurance journey: Farmer enrolls in a policy
// Flow: Fill details → Review & confirm → Setup EMI payment → Done (pending provider approval)

import React, { useState } from 'react';
import axios from 'axios';

const PAYMENT_METHODS = [
  { id: 'upi',     icon: '📱', label: 'UPI' },
  { id: 'card',    icon: '💳', label: 'Card' },
  { id: 'netbank', icon: '🏦', label: 'Net Banking' },
];
const UPI_APPS = ['PhonePe', 'Google Pay', 'Paytm', 'BHIM'];

function PolicyEnrollmentForm({ policy, token, onClose }) {
  const [step, setStep] = useState(1); // 1=Farm Details, 2=Review, 3=EMI Setup, 4=Done
  const [formData, setFormData] = useState({
    cropType: '',
    farmArea: '',
    farmRegion: '',
    startDate: '',
    nominee: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [selectedBank, setSelectedBank] = useState('');
  const [emiFrequency, setEmiFrequency] = useState('monthly');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = e => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  // Calculate EMI based on frequency
  const emiAmount = {
    monthly:   Math.round(policy.premiumPrice / 6),
    quarterly: Math.round(policy.premiumPrice / 2),
    annual:    policy.premiumPrice,
  }[emiFrequency];

  const submitEnrollment = async () => {
    setLoading(true); setError('');
    try {
      // POST to enrollment endpoint
      await axios.post('http://localhost:5000/api/enrollments/apply', {
        policyId: policy._id,
        cropType: formData.cropType,
        farmArea: formData.farmArea,
        farmRegion: formData.farmRegion,
        startDate: formData.startDate,
        nominee: formData.nominee,
        paymentMethod,
        emiFrequency,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const STEPS = ['Farm Details', 'Review', 'EMI Setup', 'Enrolled'];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '600px' }}>

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--white)' }}>
              Enroll in Policy
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--earth-400)' }}>
              {policy.name} · {policy.companyName}
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Step Progress */}
        <div style={{ padding: '1.25rem 2rem 0', display: 'flex', gap: 0 }}>
          {STEPS.map((label, i) => {
            const num = i + 1; const done = num < step; const active = num === step;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: '14px', left: '50%', right: '-50%', height: '2px', background: done ? 'var(--gold)' : 'rgba(255,255,255,0.1)', transition: 'background 0.4s', zIndex: 0 }} />
                )}
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: done ? 'var(--gold)' : active ? 'rgba(201,153,58,0.2)' : 'rgba(255,255,255,0.05)', border: `2px solid ${active || done ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: done ? 'var(--earth-900)' : active ? 'var(--gold)' : 'var(--earth-500)', position: 'relative', zIndex: 1, transition: 'all 0.3s' }}>
                  {done ? '✓' : num}
                </div>
                <span style={{ fontSize: '0.62rem', marginTop: '4px', color: active ? 'var(--gold-light)' : done ? 'var(--earth-300)' : 'var(--earth-500)', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="modal-body">

          {/* ── STEP 1: FARM DETAILS ── */}
          {step === 1 && (
            <div style={{ animation: 'fadeUp 0.35s ease both' }}>
              <div className="modal-policy-info" style={{ marginBottom: '1.5rem' }}>
                <div className="name">{policy.name}</div>
                <div className="meta">
                  Coverage: {policy.coverageType} · Max Payout: ₹{policy.coverageAmount?.toLocaleString('en-IN')} · Premium: ₹{policy.premiumPrice?.toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Crop Type</label>
                    <input type="text" name="cropType" value={formData.cropType} onChange={onChange}
                      className="form-input" placeholder="Wheat, Rice, Cotton..." required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Farm Area (Acres)</label>
                    <input type="number" name="farmArea" value={formData.farmArea} onChange={onChange}
                      className="form-input" placeholder="e.g. 5.5" min="0" step="0.1" required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Farm Region / District</label>
                  <input type="text" name="farmRegion" value={formData.farmRegion} onChange={onChange}
                    className="form-input" placeholder="e.g. Ludhiana, Punjab" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Desired Start Date</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={onChange}
                    className="form-input" min={new Date().toISOString().split('T')[0]} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Nominee Name (optional)</label>
                  <input type="text" name="nominee" value={formData.nominee} onChange={onChange}
                    className="form-input" placeholder="e.g. Sunita Devi (spouse)" />
                </div>

                {/* Info box */}
                <div style={{ padding: '0.85rem 1rem', background: 'rgba(82,183,136,0.06)', border: '1px solid rgba(82,183,136,0.15)', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--earth-300)', margin: 0, lineHeight: 1.6 }}>
                    ℹ️ After submission, your enrollment request will be sent to <strong style={{ color: 'var(--gold-light)' }}>{policy.companyName}</strong> for approval. Once approved, your EMI payments will begin on your selected start date.
                  </p>
                </div>

                {error && <div className="alert alert-error">⚠ {error}</div>}

                <button className="btn-primary" style={{ width: '100%' }}
                  onClick={() => {
                    if (!formData.cropType || !formData.farmArea || !formData.farmRegion || !formData.startDate) {
                      setError('Please fill all required fields.'); return;
                    }
                    setError(''); setStep(2);
                  }}>
                  Review Application →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: REVIEW ── */}
          {step === 2 && (
            <div style={{ animation: 'fadeUp 0.35s ease both' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--earth-300)', marginBottom: '1.25rem' }}>
                Please review your enrollment details before proceeding to payment setup.
              </p>

              {/* Policy summary */}
              <div style={{ background: 'rgba(14,11,7,0.5)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(201,153,58,0.15)', overflow: 'hidden', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(201,153,58,0.08)', borderBottom: '1px solid rgba(201,153,58,0.1)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Policy Details</span>
                </div>
                {[
                  { label: 'Policy Name',    value: policy.name },
                  { label: 'Insurer',        value: policy.companyName },
                  { label: 'Coverage Type',  value: policy.coverageType },
                  { label: 'Max Payout',     value: `₹${policy.coverageAmount?.toLocaleString('en-IN')}` },
                  { label: 'Annual Premium', value: `₹${policy.premiumPrice?.toLocaleString('en-IN')}` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--earth-400)' }}>{label}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--earth-100)', fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Farm summary */}
              <div style={{ background: 'rgba(14,11,7,0.5)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(82,183,136,0.15)', overflow: 'hidden', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(82,183,136,0.06)', borderBottom: '1px solid rgba(82,183,136,0.1)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green-accent)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Farm Details</span>
                </div>
                {[
                  { label: 'Crop Type',   value: formData.cropType },
                  { label: 'Farm Area',   value: `${formData.farmArea} acres` },
                  { label: 'Region',      value: formData.farmRegion },
                  { label: 'Start Date',  value: new Date(formData.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { label: 'Nominee',     value: formData.nominee || 'Not specified' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--earth-400)' }}>{label}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--earth-100)', fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>← Edit</button>
                <button className="btn-primary" style={{ flex: 2 }} onClick={() => setStep(3)}>
                  Setup EMI Payment →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: EMI SETUP ── */}
          {step === 3 && (
            <div style={{ animation: 'fadeUp 0.35s ease both' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--earth-300)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                Choose how you want to pay your premium. EMI payments will only begin after your enrollment is <strong style={{ color: 'var(--gold-light)' }}>approved by {policy.companyName}</strong>.
              </p>

              {/* EMI Frequency */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div className="form-label" style={{ marginBottom: '0.6rem' }}>Payment Frequency</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
                  {[
                    { id: 'monthly',   label: 'Monthly',   sub: `₹${Math.round(policy.premiumPrice/6)}/mo` },
                    { id: 'quarterly', label: 'Quarterly', sub: `₹${Math.round(policy.premiumPrice/2)}/qtr` },
                    { id: 'annual',    label: 'Annual',    sub: `₹${policy.premiumPrice}/yr` },
                  ].map(f => (
                    <button key={f.id} type="button"
                      onClick={() => setEmiFrequency(f.id)}
                      style={{
                        padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-md)',
                        border: `1px solid ${emiFrequency === f.id ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                        background: emiFrequency === f.id ? 'rgba(201,153,58,0.12)' : 'rgba(14,11,7,0.4)',
                        color: emiFrequency === f.id ? 'var(--gold-light)' : 'var(--earth-400)',
                        font: 'inherit', cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                      }}>
                      <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>{f.label}</span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{f.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* EMI summary box */}
              <div style={{ padding: '1rem 1.25rem', background: 'rgba(201,153,58,0.07)', border: '1px solid rgba(201,153,58,0.2)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--earth-400)', marginBottom: '4px' }}>Your EMI Amount</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                    ₹{emiAmount.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--earth-400)', marginTop: '2px' }}>
                    First payment on {formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'start date'} (after approval)
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--earth-400)' }}>Total Annual</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--earth-200)' }}>₹{policy.premiumPrice?.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-label" style={{ marginBottom: '0.6rem' }}>Payment Method for EMI</div>
              <div className="payment-methods" style={{ marginBottom: '1rem' }}>
                {PAYMENT_METHODS.map(m => (
                  <button key={m.id} className={`payment-method-btn ${paymentMethod === m.id ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(m.id)}>
                    <span className="pay-icon">{m.icon}</span>{m.label}
                  </button>
                ))}
              </div>

              {/* UPI */}
              {paymentMethod === 'upi' && (
                <div className="payment-card-input" style={{ animation: 'fadeUp 0.3s ease both', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">UPI ID</label>
                    <input type="text" className="form-input" placeholder="yourname@upi"
                      value={upiId} onChange={e => setUpiId(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {UPI_APPS.map(app => (
                      <div key={app} style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, background: 'rgba(201,153,58,0.1)', color: 'var(--gold-light)', border: '1px solid rgba(201,153,58,0.2)', cursor: 'pointer' }}>{app}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Card */}
              {paymentMethod === 'card' && (
                <div className="payment-card-input" style={{ animation: 'fadeUp 0.3s ease both', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input type="text" className="form-input" placeholder="•••• •••• •••• ••••" maxLength={19}
                      value={cardData.number} onChange={e => setCardData({ ...cardData, number: e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim() })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Name on Card</label>
                    <input type="text" className="form-input" placeholder="RAJESH KUMAR"
                      value={cardData.name} onChange={e => setCardData({ ...cardData, name: e.target.value.toUpperCase() })} />
                  </div>
                  <div className="payment-card-row">
                    <div className="form-group">
                      <label className="form-label">Expiry</label>
                      <input type="text" className="form-input" placeholder="MM/YY" maxLength={5}
                        value={cardData.expiry} onChange={e => setCardData({ ...cardData, expiry: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input type="password" className="form-input" placeholder="•••" maxLength={3}
                        value={cardData.cvv} onChange={e => setCardData({ ...cardData, cvv: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'netbank' && (
                <div className="payment-card-input" style={{ animation: 'fadeUp 0.3s ease both', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Select Bank</label>
                    <select className="form-input" value={selectedBank} onChange={e => setSelectedBank(e.target.value)}
                      style={{ background: 'rgba(14,11,7,0.5)', color: 'var(--earth-200)' }}>
                      <option value="">-- Select Your Bank --</option>
                      {['State Bank of India','Punjab National Bank','Bank of Baroda','HDFC Bank','ICICI Bank','Axis Bank','Canara Bank','Union Bank','Kotak Mahindra Bank'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Security note */}
              <div style={{ padding: '0.75rem 1rem', background: 'rgba(82,183,136,0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(82,183,136,0.15)', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.72rem', color: 'var(--earth-400)', margin: 0 }}>
                  🔒 Your payment details are saved securely for EMI auto-debit. <strong style={{ color: 'var(--green-accent)' }}>No amount will be charged today</strong> — first payment starts only after provider approval.
                </p>
              </div>

              {error && <div className="alert alert-error" style={{ marginBottom: '0.75rem' }}>⚠ {error}</div>}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}>← Back</button>
                <button className="btn-primary" style={{ flex: 2 }} disabled={loading} onClick={submitEnrollment}>
                  {loading
                    ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span style={{ width: '14px', height: '14px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: 'rgba(0,0,0,0.7)', borderRadius: '50%', display: 'inline-block', animation: 'spinSlow 0.6s linear infinite' }} />
                        Submitting...
                      </span>
                    : '✓ Submit Enrollment Request'}
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: SUCCESS ── */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', animation: 'scaleIn 0.5s ease both' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(201,153,58,0.15)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 1.5rem', animation: 'pulse-gold 2s ease-in-out infinite' }}>
                📋
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--white)', marginBottom: '0.75rem' }}>
                Enrollment Submitted!
              </h3>
              <p style={{ color: 'var(--earth-300)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Your enrollment request for <strong style={{ color: 'var(--gold-light)' }}>{policy.name}</strong> has been sent to <strong style={{ color: 'var(--gold-light)' }}>{policy.companyName}</strong> for approval.
              </p>
              <div style={{ padding: '1rem', background: 'rgba(14,11,7,0.5)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '1.5rem', textAlign: 'left' }}>
                {[
                  { label: 'Status',       value: '⏳ Pending Provider Approval' },
                  { label: 'EMI Starts',   value: `After approval · ₹${emiAmount.toLocaleString('en-IN')} ${emiFrequency}` },
                  { label: 'Next Step',    value: 'Provider reviews in 24–48 hours' },
                  { label: 'After that',   value: 'You can file claims anytime from dashboard' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--earth-400)' }}>{label}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--earth-200)', fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
              <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>
                Back to Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default PolicyEnrollmentForm;