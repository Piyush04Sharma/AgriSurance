// F:\Mehnat\frontend\src\components\ClaimSubmissionForm.jsx

import React, { useState } from 'react';
import axios from 'axios';

function ClaimSubmissionForm({ policy, token, onClose }) {
    
    const [formData, setFormData] = useState({
        farmAreaAffected: '', cropType: '', lossDescription: '', estimatedLossValue: '', policy: policy._id, 
    });
    
    const [claimImage, setClaimImage] = useState(null); 
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    
    const { farmAreaAffected, cropType, lossDescription, estimatedLossValue } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage('');
        setError(null);
    };

    const handleFileChange = (e) => {
        setClaimImage(e.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError(null);

        if (!claimImage) {
            setError('Please upload an image proof for your claim.');
            return;
        }

        const data = new FormData();
        // Append all fields
        data.append('farmAreaAffected', farmAreaAffected); data.append('cropType', cropType); 
        data.append('lossDescription', lossDescription); data.append('estimatedLossValue', estimatedLossValue); 
        data.append('policy', formData.policy); data.append('claimImage', claimImage); 

        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };
            await axios.post('http://localhost:5000/api/claims/submit', data, config);

            setMessage('Claim submitted successfully! You can close the form now.');
            // Clear form after submission
            setFormData({ farmAreaAffected: '', cropType: '', lossDescription: '', estimatedLossValue: '', policy: policy._id });
            setClaimImage(null);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Claim submission failed due to server error.';
            setError(errorMessage);
        }
    };
    
    // --- Modal/Form Styling ---
    const modalStyle = {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, overflowY: 'auto', 
    };

    const formContainerStyle = {
        backgroundColor: '#303030', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '550px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)', position: 'relative', color: '#f0e6d6', margin: '20px 0', 
    };

    return (
        <div style={modalStyle}>
            <div style={formContainerStyle}>
                <button onClick={onClose} style={{ position: 'absolute', top: '15px', right: '15px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>
                    X
                </button>
                
                <h2 style={{ color: '#d4a948', marginBottom: '15px' }}>Submit Claim for: {policy.name}</h2>
                <p>Insured by: {policy.companyName || 'N/A'}</p>
                <p style={{ marginBottom: '20px' }}>Policy ID: {policy._id}</p>
                
                {message && <p style={{ color: 'lightgreen', fontWeight: 'bold' }}>{message}</p>}
                {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
                
                <form onSubmit={onSubmit}>
                    {/* Form fields - FINAL SPACING APPLIED */}
                    
                    {/* Farm Area Affected */}
                    <div style={{marginBottom: '15px'}}>
                        <label htmlFor="farmAreaAffected">Farm Area Affected (Acres)</label>
                        <input type="number" id="farmAreaAffected" name="farmAreaAffected" 
                            value={farmAreaAffected} onChange={onChange} required />
                    </div>

                    {/* Crop Type */}
                    <div style={{marginBottom: '15px'}}>
                        <label htmlFor="cropType">Crop Type</label>
                        <input type="text" id="cropType" name="cropType" 
                            value={cropType} onChange={onChange} required />
                    </div>

                    {/* Estimated Loss Value */}
                    <div style={{marginBottom: '15px'}}>
                        <label htmlFor="estimatedLossValue">Estimated Loss Value (₹)</label>
                        <input type="number" id="estimatedLossValue" name="estimatedLossValue" 
                            value={estimatedLossValue} onChange={onChange} required />
                    </div>
                    
                    {/* Loss Description */}
                    <div style={{marginBottom: '15px'}}>
                        <label htmlFor="lossDescription">Loss Description</label>
                        <textarea id="lossDescription" name="lossDescription" rows="3" 
                            value={lossDescription} onChange={onChange} required />
                    </div>

                    {/* Image Proof (File Input) */}
                    <div style={{marginBottom: '30px'}}> {/* Extra space for file input */}
                        <label htmlFor="claimImage">Upload Image Proof (.jpg, .png)</label>
                        <input type="file" id="claimImage" name="claimImage" accept="image/*" 
                            onChange={handleFileChange} required />
                    </div>
                    
                    <button type="submit" style={{ marginBottom: '15px' }}>Submit Claim</button> {/* Space below submit button */}
                </form>
            </div>
        </div>
    );
}

export default ClaimSubmissionForm;