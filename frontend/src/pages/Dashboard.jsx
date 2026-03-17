// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import FarmerDashboard from './FarmerDashboard.jsx';
import ProposerDashboard from './ProposerDashboard.jsx';
import axios from 'axios';

function Dashboard() {
  const { token, user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedRole = res.data?.user?.role;
        setRole(fetchedRole);
        if (res.data?.user) setUser(prev => ({ ...prev, ...res.data.user }));
      } catch {
        setRole(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem' }}>
      <div className="loading-spinner" />
      <p style={{ color: 'var(--earth-400)', fontSize: '0.875rem' }}>Loading your dashboard...</p>
    </div>
  );

  const resolvedRole = role || user?.role;
  if (resolvedRole === 'Farmer') return <FarmerDashboard />;
  if (resolvedRole === 'Proposer' || resolvedRole === 'Admin') return <ProposerDashboard />;
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--earth-400)' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
      <p>Unable to load dashboard. Please log out and sign in again.</p>
    </div>
  );
}

export default Dashboard;
