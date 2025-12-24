import React from 'react';

function About() {
  return (
    // Outer padding and centering maintained
    <div style={{ padding: '20px', textAlign: 'center' }}>
      
      {/* --- CRITICAL: Wrapper for Styling and Centering --- */}
      <div 
        className="about-content-wrapper" 
        style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          padding: '40px',
          borderRadius: '12px',
          // Dark, semi-transparent background matching the Home page overlay
          backgroundColor: 'rgba(30, 30, 30, 0.85)', 
          // Set text color to cream/white for visibility over the overlay
          color: '#f0e6d6', 
          boxShadow: '0 8px 15px rgba(0, 0, 0, 0.4)',
          textAlign: 'left' // Align content text to the left inside the box
        }}
      > 
        {/* Main Heading */}
        <h2 style={{ color: '#d4a948', fontSize: '2em', marginBottom: '20px', textAlign: 'center' }}>
          About Our Decentralized Crop Insurance Portal
        </h2>
        
        <p style={{ marginTop: '15px', lineHeight: '1.6' }}>
          This application provides a secure and transparent platform connecting farmers and insurance providers (Proposers) digitally, facilitating quick claim processing and policy management.
        </p>
        
        <hr style={{ margin: '30px 0', background: '#d4a948' }}/>
        
        <h3>The User Roles</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', marginTop: '20px' }}>
          
          {/* Farmer Card */}
          <div style={{ flex: 1, padding: '20px', backgroundColor: 'rgba(51, 51, 51, 0.7)', borderRadius: '8px', borderLeft: '3px solid #d4a948' }}>
            <h4 style={{ color: '#d4a948' }}>🧑‍🌾 Farmer</h4>
            <p style={{ fontSize: '0.9em', marginTop: '10px' }}>
              Farmers are the primary users. Their dashboard allows them to select policies offered by Proposers, submit claims with geographical and photographic proof, and track the status of their payments.
            </p>
          </div>

          {/* Proposer Card */}
          <div style={{ flex: 1, padding: '20px', backgroundColor: 'rgba(51, 51, 51, 0.7)', borderRadius: '8px', borderLeft: '3px solid #f0e6d6' }}>
            <h4 style={{ color: '#d4a948' }}>🛡️ Proposer (Insurance Provider)</h4>
            <p style={{ fontSize: '0.9em', marginTop: '10px' }}>
              Proposers manage the business end. Their portal is used to create new insurance policy plans (like Drought or Flood coverage) and review, approve, or reject claims submitted by Farmers.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default About;