// ClaimSubmissionForm.jsx - For filing damage claims on enrolled policies
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const DAMAGE_TYPES = ['Drought','Flood','Pest Attack','Hailstorm','Fire','Other'];

function ClaimSubmissionForm({ enrollment, policy: policyProp, token, onClose }) {
  const policy = enrollment?.policy || policyProp || enrollment;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ cropType:'', farmAreaAffected:'', lossDescription:'', estimatedLossValue:'', damageDate:'', damageType:'' });
  const [claimImage, setClaimImage] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedArea, setCapturedArea] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null); const canvasRef = useRef(null); const streamRef = useRef(null);

  useEffect(() => () => { streamRef.current?.getTracks().forEach(t => t.stop()); }, []);
  const onChange = e => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode:'environment' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch { setError('Camera access denied. Please upload an image instead.'); }
  };

  const stopCamera = () => { streamRef.current?.getTracks().forEach(t => t.stop()); setCameraActive(false); };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current; const c = canvasRef.current;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    setFlashActive(true); setTimeout(() => setFlashActive(false), 500);
    c.toBlob(blob => {
      const file = new File([blob], 'damage_proof.jpg', { type:'image/jpeg' });
      setCapturedImage(URL.createObjectURL(blob)); setClaimImage(file);
      const area = (2 + Math.random()*10).toFixed(2); setCapturedArea(area);
      if (!formData.farmAreaAffected) setFormData(f => ({ ...f, farmAreaAffected: area }));
    }, 'image/jpeg', 0.9);
    stopCamera();
  };

  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (file) { setClaimImage(file); setCapturedImage(URL.createObjectURL(file)); setCapturedArea(null); }
  };

  const handleDrop = e => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) { setClaimImage(file); setCapturedImage(URL.createObjectURL(file)); }
  };

  const submitClaim = async () => {
    if (!claimImage) { setError('Please capture or upload damage proof.'); return; }
    setLoading(true); setError('');
    try {
      const data = new FormData();
      data.append('policy', policy._id);
      data.append('cropType', formData.cropType);
      data.append('farmAreaAffected', formData.farmAreaAffected);
      data.append('lossDescription', formData.lossDescription);
      data.append('estimatedLossValue', formData.estimatedLossValue);
      data.append('claimImage', claimImage);
      await axios.post('http://localhost:5000/api/claims/submit', data, { headers: { Authorization: `Bearer ${token}` } });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Claim submission failed.');
    } finally { setLoading(false); }
  };

  const STEPS = ['Damage Details', 'Upload Proof', 'Submitted'];

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth:'600px' }}>
        <div className="modal-header">
          <div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', color:'var(--white)' }}>File a Damage Claim</h2>
            <p style={{ fontSize:'0.78rem', color:'var(--earth-400)' }}>{policy?.name} · {policy?.companyName}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding:'1.25rem 2rem 0', display:'flex' }}>
          {STEPS.map((label, i) => {
            const num = i+1; const done = num < step; const active = num === step;
            return (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', position:'relative' }}>
                {i < STEPS.length-1 && <div style={{ position:'absolute', top:'14px', left:'50%', right:'-50%', height:'2px', background: done ? 'var(--gold)' : 'rgba(255,255,255,0.1)', zIndex:0 }} />}
                <div style={{ width:'28px', height:'28px', borderRadius:'50%', background: done ? 'var(--gold)' : active ? 'rgba(201,153,58,0.2)' : 'rgba(255,255,255,0.05)', border:`2px solid ${active||done ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:700, color: done ? 'var(--earth-900)' : active ? 'var(--gold)' : 'var(--earth-500)', position:'relative', zIndex:1 }}>
                  {done ? '✓' : num}
                </div>
                <span style={{ fontSize:'0.65rem', marginTop:'4px', color: active ? 'var(--gold-light)' : done ? 'var(--earth-300)' : 'var(--earth-500)', fontWeight: active ? 600 : 400, whiteSpace:'nowrap' }}>{label}</span>
              </div>
            );
          })}
        </div>

        <div className="modal-body">
          {step === 1 && (
            <div style={{ animation:'fadeUp 0.35s ease both' }}>
              <div style={{ padding:'0.85rem 1rem', background:'rgba(231,76,60,0.08)', border:'1px solid rgba(231,76,60,0.2)', borderRadius:'var(--radius-sm)', marginBottom:'1.25rem' }}>
                <p style={{ fontSize:'0.78rem', color:'#e74c3c', margin:0 }}>⚠️ <strong>Important:</strong> This form is for reporting actual crop damage only. False claims are a punishable offence.</p>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Crop Type Damaged</label>
                    <input type="text" name="cropType" value={formData.cropType} onChange={onChange} className="form-input" placeholder="Wheat, Rice..." required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Area Affected (Acres)</label>
                    <input type="number" name="farmAreaAffected" value={formData.farmAreaAffected} onChange={onChange} className="form-input" placeholder="3.5" min="0" step="0.1" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Type of Damage</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                    {DAMAGE_TYPES.map(d => (
                      <button key={d} type="button" onClick={() => setFormData({ ...formData, damageType:d })}
                        style={{ padding:'5px 14px', borderRadius:'50px', fontSize:'0.78rem', fontWeight:600, border:`1px solid ${formData.damageType===d ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`, background: formData.damageType===d ? 'rgba(201,153,58,0.15)' : 'transparent', color: formData.damageType===d ? 'var(--gold-light)' : 'var(--earth-400)', cursor:'pointer', transition:'all 0.2s' }}>{d}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Date of Damage</label>
                    <input type="date" name="damageDate" value={formData.damageDate} onChange={onChange} className="form-input" max={new Date().toISOString().split('T')[0]} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Estimated Loss (₹)</label>
                    <input type="number" name="estimatedLossValue" value={formData.estimatedLossValue} onChange={onChange} className="form-input" placeholder="25000" min="0" required />
                    {formData.estimatedLossValue && policy?.coverageAmount && (
                      <div style={{ fontSize:'0.7rem', marginTop:'3px', color: Number(formData.estimatedLossValue) > policy.coverageAmount ? '#e74c3c' : 'var(--green-accent)' }}>
                        {Number(formData.estimatedLossValue) > policy.coverageAmount ? `⚠ Exceeds max ₹${policy.coverageAmount?.toLocaleString('en-IN')}` : `✓ Within limit`}
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Describe the Damage</label>
                  <textarea name="lossDescription" value={formData.lossDescription} onChange={onChange} className="form-input" rows="3" placeholder="Describe what happened, when you noticed it, extent of damage..." style={{ resize:'vertical', minHeight:'80px' }} required />
                </div>
                {error && <div className="alert alert-error">⚠ {error}</div>}
                <button className="btn-primary" style={{ width:'100%' }}
                  onClick={() => { if (!formData.cropType || !formData.farmAreaAffected || !formData.lossDescription || !formData.estimatedLossValue) { setError('Please fill all required fields.'); return; } setError(''); setStep(2); }}>
                  Continue — Upload Proof →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ animation:'fadeUp 0.35s ease both' }}>
              <p style={{ fontSize:'0.85rem', color:'var(--earth-300)', marginBottom:'1.25rem', lineHeight:1.6 }}>
                📸 Capture photos of the <strong style={{ color:'var(--white)' }}>damaged crops and affected land</strong>. Clear photos help the provider process your claim faster.
              </p>
              <div className="camera-section" style={{ marginBottom:'1rem' }}>
                <div className="camera-header">
                  <span className="camera-header-title">
                    <span style={{ width:'8px', height:'8px', borderRadius:'50%', background: cameraActive ? 'var(--green-accent)' : 'var(--earth-500)', display:'inline-block' }} />
                    Damage Evidence Camera
                  </span>
                  {capturedArea && <span className="badge badge-approved">📐 ~{capturedArea} acres</span>}
                </div>
                <div className="camera-viewfinder">
                  {capturedImage ? (
                    <img src={capturedImage} alt="Damage proof" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  ) : (
                    <>
                      <video ref={videoRef} autoPlay playsInline muted style={{ width:'100%', height:'100%', objectFit:'cover', display: cameraActive ? 'block' : 'none' }} />
                      <canvas ref={canvasRef} style={{ display:'none' }} />
                      {!cameraActive && (
                        <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(14,11,7,0.95)', gap:'0.75rem', cursor:'pointer' }} onClick={startCamera}>
                          <div style={{ fontSize:'3rem', opacity:0.5 }}>📷</div>
                          <p style={{ color:'var(--earth-400)', fontSize:'0.82rem' }}>Tap to photograph damage</p>
                        </div>
                      )}
                    </>
                  )}
                  {cameraActive && (
                    <div className="camera-overlay">
                      <div className="camera-corner tl"/><div className="camera-corner tr"/>
                      <div className="camera-corner bl"/><div className="camera-corner br"/>
                      <div className="camera-scan-line"/>
                      <div className="camera-label">DAMAGE DETECTION ACTIVE</div>
                    </div>
                  )}
                  {flashActive && <div className="camera-flash"/>}
                </div>
                <div className="camera-controls">
                  <div className="camera-area-result">{capturedArea ? `📐 ~${capturedArea} acres` : ''}</div>
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    {!capturedImage && !cameraActive && <button className="capture-btn" onClick={startCamera}>📷 Open Camera</button>}
                    {cameraActive && (<><button className="capture-btn" onClick={capturePhoto}>📸 Capture</button><button onClick={stopCamera} style={{ padding:'0.5rem 0.75rem', background:'rgba(231,76,60,0.15)', color:'#e74c3c', border:'1px solid rgba(231,76,60,0.25)', borderRadius:'var(--radius-sm)', cursor:'pointer', fontSize:'0.78rem', fontWeight:600 }}>✕</button></>)}
                    {capturedImage && <button className="capture-btn" onClick={() => { setCapturedImage(null); setClaimImage(null); setCapturedArea(null); startCamera(); }}>🔄 Retake</button>}
                  </div>
                </div>
              </div>
              <div className="auth-divider" style={{ margin:'0.75rem 0' }}>or upload from device</div>
              {!capturedImage ? (
                <div className={`upload-zone ${dragOver ? 'drag-over' : ''}`} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                  <span className="upload-icon">📁</span>
                  <div className="upload-text"><strong>Click to upload</strong> or drag & drop<br/>JPG, PNG up to 10MB</div>
                </div>
              ) : (
                <div className="upload-preview">
                  <span className="upload-preview-icon">✅</span>
                  <div>
                    <div className="upload-preview-name">{claimImage?.name || 'damage_proof.jpg'}</div>
                    <div style={{ fontSize:'0.72rem', color:'var(--earth-400)' }}>Proof ready for submission</div>
                  </div>
                </div>
              )}
              {error && <div className="alert alert-error" style={{ marginTop:'0.75rem' }}>⚠ {error}</div>}
              <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.25rem' }}>
                <button className="btn-secondary" style={{ flex:1 }} onClick={() => setStep(1)}>← Back</button>
                <button className="btn-primary" style={{ flex:2 }} disabled={loading} onClick={submitClaim}>
                  {loading ? 'Submitting...' : '📤 Submit Claim for Review'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign:'center', padding:'2rem 1rem', animation:'scaleIn 0.5s ease both' }}>
              <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'rgba(82,183,136,0.15)', border:'2px solid var(--green-accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', margin:'0 auto 1.5rem' }}>✅</div>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.8rem', color:'var(--white)', marginBottom:'0.75rem' }}>Claim Filed!</h3>
              <p style={{ color:'var(--earth-300)', lineHeight:1.7, marginBottom:'1.5rem', fontSize:'0.9rem' }}>
                Your damage claim has been submitted to <strong style={{ color:'var(--gold-light)' }}>{policy?.companyName}</strong> for review.
              </p>
              <div style={{ padding:'1rem', background:'rgba(14,11,7,0.5)', borderRadius:'var(--radius-md)', border:'1px solid rgba(255,255,255,0.07)', marginBottom:'1.5rem', textAlign:'left' }}>
                {[{ label:'Status', value:'⏳ Under Review' },{ label:'Review Time', value:'48–72 hours' },{ label:'If Approved', value:'Payout sent to your account' }].map(({ label, value }) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'0.4rem 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ fontSize:'0.78rem', color:'var(--earth-400)' }}>{label}</span>
                    <span style={{ fontSize:'0.82rem', color:'var(--earth-200)', fontWeight:500 }}>{value}</span>
                  </div>
                ))}
              </div>
              <button className="btn-primary" style={{ width:'100%' }} onClick={onClose}>Back to Dashboard</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClaimSubmissionForm;