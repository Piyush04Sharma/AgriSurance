import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  // 1. Check for the authentication token (the "VIP Wristband")
  const token = localStorage.getItem('token');

  // 2. Decide what to render
  if (!token) {
    // If NO token is found, redirect them to the login page.
    // The 'replace' prop ensures they can't use the back button to bypass the login.
    return <Navigate to="/login" replace />;
  }

  // If a token IS found, render the child route/component (the protected page).
  // We use <Outlet /> because we will wrap the protected route in the router config.
  return <Outlet />;
}

export default PrivateRoute;