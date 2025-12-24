// F:\Mehnat\frontend\src\pages\FarmerDashboard.jsx (Full file)

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import ClaimSubmissionForm from '../components/ClaimSubmissionForm.jsx'; // <-- IMPORT NEW COMPONENT

// --- NEW COMPONENT: Interactive Policy Card ---
const PolicyCard = ({ policy, isFavorite, onToggleFavorite, expanded, onToggleExpand, onApply }) => { // <-- ADDED onApply prop
    
    // Toggles the expansion/details view
    const handleExpandClick = (e) => {
        e.stopPropagation(); 
        onToggleExpand(policy._id);
    };

    return (
        <div 
            style={{ 
                // Card Styling and Layout (3 columns when not expanded)
                flex: expanded ? '100%' : '0 1 30%', 
                minWidth: expanded ? '95%' : '300px', 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', // Light background
                padding: '25px', 
                borderRadius: '10px', 
                margin: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: expanded ? '0 8px 20px rgba(0,0,0,0.7)' : '0 4px 15px rgba(0,0,0,0.4)',
                position: 'relative',
                border: expanded ? '2px solid #55483a' : '1px solid #ccc',
                color: '#101010' // Text is dark
            }}
        >
            {/* ... (Existing Policy Card UI) ... */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                    <h3 style={{ color: '#55483a', marginBottom: '5px' }}>{policy.companyName || 'Insurer Co.'}</h3>
                    <h2 style={{ color: '#d4a948', fontSize: '1.5em' }}>{policy.name}</h2>
                </div>
                
                <span onClick={(e) => { e.stopPropagation(); onToggleFavorite(policy._id); }} 
                    style={{ fontSize: '1.5em', cursor: 'pointer', color: isFavorite ? 'red' : '#55483a' }}>
                    {isFavorite ? '❤️' : '🤍'}
                </span>
            </div>

            <p style={{ fontSize: '1em', color: '#555' }}>Coverage: {policy.coverageType}</p>
            <p style={{ fontSize: '1.1em', fontWeight: 'bold', margin: '5px 0' }}>
                Premium: ₹{policy.premiumPrice} | Payout: ₹{policy.coverageAmount} Max
            </p>
            
            <hr style={{ margin: '15px 0', background: '#ccc' }}/>

            {/* --- ACTION BUTTONS --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
                
                {/* KNOW MORE (EXPAND) BUTTON */}
                <button onClick={handleExpandClick} style={{ padding: '10px 15px', backgroundColor: '#ccc', color: '#101010', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}>
                    {expanded ? 'Close Details' : 'Know More'}
                </button>
                
                {/* APPLY BUTTON (CRITICAL: Calls onApply prop) */}
                <button 
                    onClick={(e) => { e.stopPropagation(); onApply(policy); }} // <-- CALLS NEW HANDLER
                    style={{ padding: '10px 20px', backgroundColor: '#55483a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Apply
                </button>
            </div>
            
            --- EXPANDED DETAILS AREA ---
            {expanded && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                    <h4 style={{ color: '#55483a' }}>Full Description</h4>
                    <p style={{ lineHeight: '1.6', color: '#333' }}>
                        {policy.description || "No detailed description provided."}
                    </p>
                    <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#777' }}>
                        Policy ID: {policy._id}
                    </p>
                </div>
            )}
        </div>
    );
};


// --- MAIN FARMER DASHBOARD COMPONENT ---
function FarmerDashboard() {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    
    // States for Policies and Claims
    const [availablePolicies, setAvailablePolicies] = useState([]);
    const [myClaims, setMyClaims] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedPolicyId, setExpandedPolicyId] = useState(null); 
    const [favorites, setFavorites] = useState([]); 
    
    // --- NEW STATE: Controls visibility and selected policy for the claim form ---
    const [claimFormState, setClaimFormState] = useState({
        visible: false,
        selectedPolicy: null,
    });
    
    // Function to fetch active policies
    const fetchPolicies = async (config) => {
        const response = await axios.get('http://localhost:5000/api/policies/active', config);
        setAvailablePolicies(response.data);
    };

    // Function to fetch the farmer's claims (Notification data)
    const fetchMyClaims = async (config) => {
        try {
            const response = await axios.get('http://localhost:5000/api/claims/myclaims', config);
            setMyClaims(response.data);
        } catch (err) {
            console.error("Failed to fetch farmer claims:", err);
        }
    };

    useEffect(() => {
        const loadDashboard = async () => {
            if (!token) return;
            setLoading(true);
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            
            try {
                await fetchPolicies(config);
                await fetchMyClaims(config);
            } catch (err) {
                setError("Failed to load dashboard data. Check backend Policy/Claims services.");
            } finally {
                setLoading(false);
            }
        };
        loadDashboard();
    }, [token]);

    // Handlers
    const handleToggleExpand = (policyId) => {
        setExpandedPolicyId(policyId === expandedPolicyId ? null : policyId);
    };

    const handleToggleFavorite = (policyId) => {
        setFavorites(prev => 
            prev.includes(policyId) 
                ? prev.filter(id => id !== policyId) 
                : [...prev, policyId]
        );
    };
    
    // --- HANDLER FOR APPLY BUTTON ---
    const handleApply = (policy) => {
        setClaimFormState({
            visible: true,
            selectedPolicy: policy, // Pass the entire policy object
        });
    };
    
    // Handler to close the claim form
    const handleCloseClaimForm = () => {
        setClaimFormState({ visible: false, selectedPolicy: null });
    };

    if (loading) {
        return <h2 style={{ padding: '20px', color: '#d4a948' }}>Loading Policy Marketplace...</h2>;
    }

    // --- Farmer Claims Summary / Notifications ---
    const approvedCount = myClaims.filter(c => c.status === 'Approved').length;
    const totalCount = myClaims.length;

    return (
        <div className="role-dashboard" style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ color: '#d4a948', marginBottom: '10px', textAlign: 'center' }}>
                Policy Marketplace
            </h1>
            
            {/* --- FARMER CLAIMS SUMMARY / NOTIFICATIONS --- */}
            <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: 'rgba(51, 51, 51, 0.9)', borderRadius: '12px', border: '1px solid #55483a', color: '#f0e6d6' }}>
                <h3 style={{ color: '#f0e6d6', marginBottom: '15px' }}>
                    Notifications: Your Claim Status
                </h3>
                
                {approvedCount > 0 && <p style={{ color: 'lightgreen', fontWeight: 'bold' }}>✅ Great news! {approvedCount} claim(s) have been approved.</p>}
                
                <p style={{ color: '#ccc' }}>You have {totalCount} total claims submitted.</p>
                <Link to="/claims-history" style={{ color: '#d4a948', marginTop: '10px', display: 'block' }}>
                    View Claims History (Future Feature)
                </Link>
            </div>


            {/* --- POLICY CARD MARKETPLACE --- */}
            <h2 style={{ color: '#55483a', marginTop: '50px', marginBottom: '20px', textAlign: 'center' }}>
                Available Insurance Plans
            </h2>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {availablePolicies.length === 0 ? (
                    <p style={{ color: 'orange' }}>No active policies available from providers yet.</p>
                ) : (
                    availablePolicies.map(policy => (
                        <PolicyCard 
                            key={policy._id}
                            policy={policy}
                            isFavorite={favorites.includes(policy._id)}
                            onToggleFavorite={handleToggleFavorite}
                            expanded={expandedPolicyId === policy._id}
                            onToggleExpand={handleToggleExpand}
                            onApply={handleApply} // <-- PASS HANDLER TO CARD
                        />
                    ))
                )}
            </div>
            
            {/* --- 2. Render Claim Form Modal/Component --- */}
            {claimFormState.visible && claimFormState.selectedPolicy && (
                <ClaimSubmissionForm 
                    policy={claimFormState.selectedPolicy} 
                    token={token}
                    onClose={handleCloseClaimForm}
                />
            )}
        </div>
    );
}

export default FarmerDashboard;