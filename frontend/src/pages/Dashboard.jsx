import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx'; 
import FarmerDashboard from './FarmerDashboard.jsx'; 
import ProposerDashboard from './ProposerDashboard.jsx'; 
import axios from 'axios';

function Dashboard() {
  const { user, token } = useAuth(); 
  
  const [protectedData, setProtectedData] = useState(null);
  const [loading, setLoading] = useState(true); // <-- Controls main render state
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if we have a valid token
    if (token) {
      const fetchProtectedData = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/auth/profile', {
            headers: {
              'Authorization': `Bearer ${token}` 
            }
          });
          
          setProtectedData(response.data);
          setError(null);
        } catch (err) {
          setError(err.response ? err.response.data.message : 'Failed to fetch protected data.');
        } finally {
          setLoading(false); // Set to false once fetch is complete (success or fail)
        }
      };
      
      fetchProtectedData();
    } else {
        setLoading(false);
    }
    
  }, [token]); 


  // --- ROLE SWITCHING LOGIC ---
  const renderRoleDashboard = () => {
    // Check for role based on the fetched data structure
    const role = protectedData?.user?.role; 
    
    switch (role) {
      case 'Farmer':
        return <FarmerDashboard />;
      case 'Proposer':
        return <ProposerDashboard />;
      case 'Admin':
        return <h2>⚙️ Admin Dashboard - Full Access</h2>;
      default:
        return <h2>❌ Unknown Role or No User Data Found</h2>;
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px' }}>
      
      <h1>Welcome to the Dashboard, {user?.name || 'User'}!</h1>
      <p style={{marginBottom: '20px', color: '#ccc'}}>Your current role is: **{protectedData?.user?.role || 'Fetching...'}**</p>
      
      <hr style={{ margin: '20px 0' }}/>
      
      {/* 1. Show Loading State */}
      {loading && <p>Loading user profile details...</p>}

      {/* 2. Show Error State */}
      {!loading && error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
      {/* 3. Show Dashboard Content (Role Switch) */}
      {!loading && protectedData && (
        <>
          {/* Render the role-specific component */}
          {renderRoleDashboard()}
          
          <hr style={{ margin: '20px 0' }}/>
          
          <h3>Protected Data Status:</h3>
          <p style={{ color: 'green' }}>Successfully received protected data from backend!</p>
          <pre style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: '10px' }}>
            {JSON.stringify(protectedData, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}

export default Dashboard;