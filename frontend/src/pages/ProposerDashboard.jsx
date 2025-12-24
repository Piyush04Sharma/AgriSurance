// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext.jsx';

// function ProposerDashboard() {
//     const { token, user } = useAuth();
//     const [claims, setClaims] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [updateStatus, setUpdateStatus] = useState(null);
//     const [showNewPlanForm, setShowNewPlanForm] = useState(false); 

//     // --- POLICY FORM STATE (Includes Company Name) ---
//     const [policyForm, setPolicyForm] = useState({
//         name: '',
//         description: '',
//         coverageType: 'Drought',
//         premiumPrice: 0,
//         coverageAmount: 0,
//         companyName: user?.companyName || '', // Pre-fill if user model has companyName
//     });
//     const [policyMessage, setPolicyMessage] = useState(null);
//     const [policyError, setPolicyError] = useState(null);

//     // --- Claim Fetching Logic (Retrieved from stable code) ---
//     const fetchClaims = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const config = { headers: { 'Authorization': `Bearer ${token}` } };
            
//             // NOTE: We rely on the stable retrieval logic here, which returns only Pending status.
//             const response = await axios.get('http://localhost:5000/api/claims/pending', config);
            
//             setClaims(response.data);
//             setError(null);
//         } catch (err) {
//             const errorMessage = 'Failed to fetch claims list. (Data dependency error, try refreshing)';
//             setError(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (token) {
//             // Set default company name if available in user object (future feature)
//             if (user?.companyName) {
//                  setPolicyForm(prev => ({...prev, companyName: user.companyName}));
//             }
//             fetchClaims();
//         }
//     }, [token, user]);

//     // --- Policy Form Handlers ---
//     const handlePolicyChange = (e) => {
//         setPolicyForm({ ...policyForm, [e.target.name]: e.target.value });
//         setPolicyMessage(null);
//         setPolicyError(null);
//     };

//     const handlePolicySubmit = async (e) => {
//         e.preventDefault();
//         setPolicyMessage(null);
//         setPolicyError(null);

//         if (policyForm.premiumPrice <= 0 || policyForm.coverageAmount <= 0 || !policyForm.companyName) {
//             setPolicyError("Premium, Coverage, and Company Name are required.");
//             return;
//         }

//         try {
//             const config = { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } };
//             const response = await axios.post(
//                 'http://localhost:5000/api/policies/create',
//                 policyForm, 
//                 config
//             );

//             setPolicyMessage(`Policy "${response.data.policy.name}" created successfully! ID: ${response.data.policy._id}.`);

//             // Clear form after success
//             setPolicyForm({ name: '', description: '', coverageType: 'Drought', premiumPrice: 0, coverageAmount: 0, companyName: policyForm.companyName });

//         } catch (err) {
//             console.error("Policy creation error:", err);
//             const errMsg = err.response?.data?.message || 'Failed to create policy.';
//             setPolicyError(errMsg);
//         }
//     };

//     // --- Claim Status Update Handler ---
//     const handleUpdateStatus = async (claimId, newStatus) => {
//         try {
//             setUpdateStatus({ claimId, status: 'processing' });

//             const config = { headers: { 'Authorization': `Bearer ${token}` } };

//             const response = await axios.put(`http://localhost:5000/api/claims/status/${claimId}`,
//                 { status: newStatus },
//                 config
//             );
            
//             fetchClaims(); // Refresh list after update
//             setUpdateStatus({ claimId: null, status: response.data.message });

//         } catch (err) {
//             setUpdateStatus({
//                 claimId,
//                 status: 'error',
//                 message: err.response?.data?.message || `Failed to set status to ${newStatus}`
//             });
//         }
//     };

//     if (loading) {
//         return (
//             <div className="role-dashboard" style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>
//                 <h2 style={{ color: '#d4a948' }}>🛡️ Proposer Management Portal</h2>
//                 <p style={{ color: '#f0e6d6' }}>Loading pending claims...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="role-dashboard" style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
//             <h1 style={{ color: '#d4a948', marginBottom: '10px', textAlign: 'center' }}>
//                 🛡️ Proposer Management Portal
//             </h1>
//             <p style={{ marginBottom: '30px', textAlign: 'center', color: '#f0e6d6' }}>
//                 Welcome, {user?.name}. Manage policies and review claims below.
//             </p>

//             {/* --- POLICY CREATION AND CLAIMS CONTAINER (FLEXBOX) --- */}
//             <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
                
//                 {/* A. POLICY CREATION COLUMN (Half Width) */}
//                 <div style={{ flex: '0 1 45%', minWidth: '450px' }}>
                    
//                     {/* Toggle Button */}
//                     <button
//                         onClick={() => setShowNewPlanForm(!showNewPlanForm)}
//                         style={{ padding: '10px 20px', backgroundColor: '#55483a', color: '#f0e6d6', border: 'none', borderRadius: '4px', width: '100%', marginBottom: '20px' }}>
//                         {showNewPlanForm ? 'Hide Policy Creation Form' : '✨ Create New Policy Plan'}
//                     </button>

//                     {/* Policy Creation Form */}
//                     {showNewPlanForm && (
//                         <div style={{ padding: '30px', backgroundColor: 'rgba(51, 51, 51, 0.9)', borderRadius: '12px', border: '1px solid #d4a948' }}>
//                             <h3 style={{ color: '#d4a948', marginBottom: '15px' }}>Policy Details</h3>
//                             {policyMessage && <p style={{ color: 'lightgreen' }}>{policyMessage}</p>}
//                             {policyError && <p style={{ color: 'red' }}>{policyError}</p>}

//                             <form onSubmit={handlePolicySubmit}>
//                                 {/* Company Name */}
//                                 <div style={{ marginBottom: '10px' }}>
//                                     <label style={{ color: '#f0e6d6' }}>Company Name</label>
//                                     <input type="text" name="companyName" value={policyForm.companyName} onChange={handlePolicyChange} required />
//                                 </div>
//                                 {/* ... (Other form fields follow the same structure) ... */}
//                                 <div style={{ marginBottom: '10px' }}>
//                                     <label style={{ color: '#f0e6d6' }}>Policy Name</label>
//                                     <input type="text" name="name" value={policyForm.name} onChange={handlePolicyChange} required />
//                                 </div>
//                                 <div style={{ marginBottom: '10px' }}>
//                                     <label style={{ color: '#f0e6d6' }}>Description</label>
//                                     <textarea name="description" value={policyForm.description} onChange={handlePolicyChange} style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(40, 44, 52, 0.6)', color: '#f0f0f0', border: '1px solid #555', borderRadius: '4px' }} required />
//                                 </div>
//                                 <div style={{ marginBottom: '10px' }}>
//                                     <label style={{ color: '#f0e6d6' }}>Coverage Type</label>
//                                     <select name="coverageType" value={policyForm.coverageType} onChange={handlePolicyChange} required>
//                                         <option value="Drought">Drought</option>
//                                         <option value="Flood">Flood</option>
//                                         <option value="Pest">Pest</option>
//                                     </select>
//                                 </div>
//                                 <div style={{ marginBottom: '10px' }}>
//                                     <label style={{ color: '#f0e6d6' }}>Premium Price (₹)</label>
//                                     <input type="number" name="premiumPrice" value={policyForm.premiumPrice} onChange={handlePolicyChange} required />
//                                 </div>
//                                 <div style={{ marginBottom: '20px' }}>
//                                     <label style={{ color: '#f0e6d6' }}>Max Payout (₹)</label>
//                                     <input type="number" name="coverageAmount" value={policyForm.coverageAmount} onChange={handlePolicyChange} required />
//                                 </div>

//                                 <button type="submit" style={{ width: 'auto', padding: '10px 20px', backgroundColor: '#d4a948' }}>Create Policy Plan</button>
//                             </form>
//                         </div>
//                     )}
//                 </div>


//                 {/* B. PENDING CLAIMS COLUMN (Half Width) */}
//                 <div style={{ flex: '0 1 45%', minWidth: '450px' }}>
//                     <div style={{ padding: '30px', backgroundColor: 'rgba(51, 51, 51, 0.9)', borderRadius: '12px', border: '1px solid #55483a' }}>
//                         <h3 style={{ color: '#f0e6d6', marginBottom: '15px' }}>Pending Claims for Review ({claims.length})</h3>

//                         {/* Refresh Button */}
//                         <div style={{ marginBottom: '20px' }}>
//                             <button onClick={fetchClaims} disabled={loading} style={{ 
//                                 padding: '8px 15px', 
//                                 backgroundColor: '#d4a948', 
//                                 color: '#101010', 
//                                 border: 'none', 
//                                 borderRadius: '4px' 
//                             }}>
//                                 {loading ? 'Refreshing...' : 'Refresh Claims List'}
//                             </button>
//                         </div>

//                         {/* Status Messages */}
//                         {updateStatus && updateStatus.status !== 'processing' && (
//                             <p style={{ color: updateStatus.status === 'error' ? 'red' : 'lightgreen', fontWeight: 'bold', marginBottom: '10px' }}>
//                                 {updateStatus.message || `Claim update processed.`}
//                             </p>
//                         )}

//                         {error && <p style={{ color: 'red', fontWeight: 'bold', marginBottom: '10px' }}>{error}</p>}

//                         {/* Claims List */}
//                         <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
//                             {claims.length === 0 && !error && !loading ? (
//                                 <p style={{ color: '#ccc' }}>🎉 No new claims are currently pending review.</p>
//                             ) : (
//                                 <div className="claims-list">
//                                     {claims.map((claim) => (
//                                         <div key={claim._id} className="claim-card" style={{
//                                             border: '1px solid #d4a948',
//                                             padding: '15px',
//                                             marginBottom: '15px',
//                                             borderRadius: '8px',
//                                             backgroundColor: 'rgba(255, 255, 255, 0.1)'
//                                         }}>
//                                             <h4 style={{ color: '#fff' }}>Claim ID: {claim._id.substring(0, 10)}...</h4>
//                                             <p style={{ color: '#ccc' }}><strong>Status:</strong> <span style={{ color: 'orange' }}>{claim.status}</span></p>
//                                             <p style={{ color: '#ccc' }}><strong>Farmer ID:</strong> {claim.user}</p> 
//                                             <p style={{ color: '#ccc' }}><strong>Loss Value:</strong> ₹{claim.estimatedLossValue}</p>

//                                             <div style={{ marginTop: '15px' }}>
//                                                 <button
//                                                     onClick={() => handleUpdateStatus(claim._id, 'Approved')}
//                                                     style={{ background: 'green', color: 'white', marginRight: '10px', padding: '5px 10px', width: 'auto' }}>
//                                                     Approve
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleUpdateStatus(claim._id, 'Rejected')}
//                                                     style={{ background: 'red', color: 'white', padding: '5px 10px', width: 'auto' }}>
//                                                     Reject
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ProposerDashboard;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';

function ProposerDashboard() {
    const { token, user } = useAuth();
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // --- VIEW STATE ---
    const [activeView, setActiveView] = useState('create'); // 'create' or 'running'
    
    // --- POLICY LIST STATE ---
    const [myPolicies, setMyPolicies] = useState([]);
    const [editingPolicy, setEditingPolicy] = useState(null);

    // --- POLICY FORM STATE ---
    const [policyForm, setPolicyForm] = useState({
        name: '',
        description: '',
        coverageType: 'Drought',
        premiumPrice: 0,
        coverageAmount: 0,
        companyName: user?.companyName || '',
    });
    const [policyMessage, setPolicyMessage] = useState(null);
    const [policyError, setPolicyError] = useState(null);

    // --- Fetch Claims (Pending Only) ---
    const fetchClaims = async () => {
        setLoading(true);
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.get('http://localhost:5000/api/claims/pending', config);
            setClaims(response.data);
        } catch (err) {
            setError('Failed to fetch claims list.');
        } finally {
            setLoading(false);
        }
    };

    // --- Fetch My Policies ---
    const fetchMyPolicies = async () => {
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            const response = await axios.get('http://localhost:5000/api/policies/my-policies', config);
            setMyPolicies(response.data);
        } catch (err) {
            console.error("Fetch policies error:", err);
        }
    };

    useEffect(() => {
        if (token) {
            fetchClaims();
            fetchMyPolicies();
        }
    }, [token]);

    // --- Handlers for Creation/Edit ---
    const handlePolicyChange = (e) => {
        setPolicyForm({ ...policyForm, [e.target.name]: e.target.value });
    };

    const handlePolicySubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } };
            
            if (editingPolicy) {
                await axios.put(`http://localhost:5000/api/policies/update/${editingPolicy}`, policyForm, config);
                setPolicyMessage("Policy updated successfully!");
                setEditingPolicy(null);
            } else {
                await axios.post('http://localhost:5000/api/policies/create', policyForm, config);
                setPolicyMessage("Policy created successfully!");
            }
            
            setPolicyForm({ name: '', description: '', coverageType: 'Drought', premiumPrice: 0, coverageAmount: 0, companyName: user?.companyName || '' });
            fetchMyPolicies();
            setActiveView('running');
        } catch (err) {
            setPolicyError("Action failed. Check console.");
        }
    };

    const deletePolicy = async (id) => {
        if (window.confirm("Are you sure you want to delete this insurance plan?")) {
            try {
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                await axios.delete(`http://localhost:5000/api/policies/delete/${id}`, config);
                fetchMyPolicies();
            } catch (err) {
                alert("Failed to delete policy.");
            }
        }
    };

    const startEdit = (policy) => {
        setEditingPolicy(policy._id);
        setPolicyForm({
            name: policy.name,
            description: policy.description,
            coverageType: policy.coverageType,
            premiumPrice: policy.premiumPrice,
            coverageAmount: policy.coverageAmount,
            companyName: policy.companyName
        });
        setActiveView('create');
    };

    if (loading) return <div style={{ color: '#d4a948', textAlign: 'center', marginTop: '50px' }}>Loading Portal...</div>;

    return (
        <div style={{ padding: '30px', maxWidth: '1300px', margin: '0 auto', color: '#f0e6d6' }}>
            <h1 style={{ color: '#d4a948', textAlign: 'center', marginBottom: '5px' }}>🛡️ Proposer Management Portal</h1>
            <p style={{ textAlign: 'center', marginBottom: '40px' }}>Welcome, {user?.name}. Manage your insurance ecosystem below.</p>

            <div style={{ display: 'flex', gap: '30px' }}>
                
                {/* --- LEFT COLUMN: MANAGEMENT --- */}
                <div style={{ flex: '1' }}>
                    
                    {/* BUTTON TOGGLE GROUP */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <button 
                            onClick={() => { setActiveView('create'); setEditingPolicy(null); }}
                            style={{ flex: 1, padding: '12px', backgroundColor: activeView === 'create' ? '#d4a948' : '#3d342c', color: activeView === 'create' ? '#101010' : '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            {editingPolicy ? '📝 Editing Policy' : '✨ Create New Plan'}
                        </button>
                        <button 
                            onClick={() => setActiveView('running')}
                            style={{ flex: 1, padding: '12px', backgroundColor: activeView === 'running' ? '#d4a948' : '#3d342c', color: activeView === 'running' ? '#101010' : '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            📋 Insurances Provided ({myPolicies.length})
                        </button>
                    </div>

                    {/* VIEW 1: CREATE/EDIT FORM */}
                    {activeView === 'create' && (
                        <div style={{ padding: '25px', backgroundColor: 'rgba(51, 51, 51, 0.9)', borderRadius: '12px', border: '1px solid #d4a948' }}>
                            <h3 style={{ color: '#d4a948', marginBottom: '20px' }}>{editingPolicy ? 'Update Policy Details' : 'New Policy Details'}</h3>
                            {policyMessage && <p style={{ color: '#4caf50', marginBottom: '10px' }}>{policyMessage}</p>}
                            <form onSubmit={handlePolicySubmit}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Company Name</label>
                                    <input type="text" name="companyName" value={policyForm.companyName} onChange={handlePolicyChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#2b231d', color: '#fff' }} required />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Policy Name</label>
                                    <input type="text" name="name" value={policyForm.name} onChange={handlePolicyChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#2b231d', color: '#fff' }} required />
                                </div>
                                
                                {/* 1. ADDED DESCRIPTION FIELD */}
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
                                    <textarea name="description" value={policyForm.description} onChange={handlePolicyChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#2b231d', color: '#fff', minHeight: '80px' }} placeholder="Explain policy details..." required />
                                </div>

                                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                    {/* 1. ADDED CROP TYPE FIELD */}
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '5px' }}>Crop Type</label>
                                        <select name="coverageType" value={policyForm.coverageType} onChange={handlePolicyChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#2b231d', color: '#fff' }}>
                                            <option value="Drought">Drought Protection</option>
                                            <option value="Flood">Flood Protection</option>
                                            <option value="Pest">Pest Control</option>
                                            <option value="All-Weather">All-Weather</option>
                                        </select>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '5px' }}>Premium (₹)</label>
                                        <input type="number" name="premiumPrice" value={policyForm.premiumPrice} onChange={handlePolicyChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#2b231d', color: '#fff' }} required />
                                    </div>
                                </div>

                                {/* 1. ADDED MAX AMOUNT (COVERAGE) FIELD */}
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px' }}>Max Amount Payable (Payout ₹)</label>
                                    <input type="number" name="coverageAmount" value={policyForm.coverageAmount} onChange={handlePolicyChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#2b231d', color: '#fff' }} required />
                                </div>

                                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#d4a948', color: '#101010', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                                    {editingPolicy ? 'Save Changes' : 'Publish Policy Plan'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* VIEW 2: RUNNING INSURANCES LIST */}
                    {activeView === 'running' && (
                        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {myPolicies.length === 0 ? <p>No policies created yet.</p> : myPolicies.map(p => (
                                <div key={p._id} style={{ padding: '15px', backgroundColor: '#2b231d', border: '1px solid #d4a948', borderRadius: '10px', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 style={{ color: '#d4a948', margin: 0 }}>{p.name}</h4>
                                        <span style={{ fontSize: '12px', background: '#55483a', padding: '2px 8px', borderRadius: '4px' }}>{p.coverageType}</span>
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#aaa', margin: '5px 0' }}>{p.description}</p>
                                    <p style={{ fontSize: '14px', color: '#ccc' }}>Premium: ₹{p.premiumPrice} | Max Payout: ₹{p.coverageAmount}</p>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        <button onClick={() => startEdit(p)} style={{ background: 'transparent', border: '1px solid #4caf50', color: '#4caf50', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>Edit</button>
                                        <button onClick={() => deletePolicy(p._id)} style={{ background: 'transparent', border: '1px solid #ff5252', color: '#ff5252', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- RIGHT COLUMN: PENDING CLAIMS --- */}
                <div style={{ flex: '0 0 400px' }}>
                    <div style={{ padding: '20px', backgroundColor: 'rgba(51, 51, 51, 0.9)', borderRadius: '12px', border: '1px solid #55483a' }}>
                        <h3 style={{ marginBottom: '20px' }}>Pending Claims ({claims.length})</h3>
                        {claims.length === 0 ? <p style={{ color: '#888' }}>No claims to review.</p> : claims.map(c => (
                            <div key={c._id} style={{ padding: '10px', borderBottom: '1px solid #444', marginBottom: '10px' }}>
                                <p style={{ margin: 0, fontSize: '14px' }}>Claim: {c._id.substring(0, 8)}</p>
                                <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>Loss: ₹{c.estimatedLossValue}</p>
                                <div style={{ marginTop: '5px' }}>
                                    <button style={{ backgroundColor: 'green', color: '#fff', border: 'none', padding: '4px 8px', marginRight: '5px', borderRadius: '4px' }}>Approve</button>
                                    <button style={{ backgroundColor: 'red', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px' }}>Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <footer style={{ marginTop: '50px', textAlign: 'center', opacity: 0.5 }}>© 2025 CropTrio Portal</footer>
        </div>
    );
}

export default ProposerDashboard;