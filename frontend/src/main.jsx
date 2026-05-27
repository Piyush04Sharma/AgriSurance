import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

// Farmer pages
import MyPolicies    from './pages/farmer/MyPolicies.jsx';
import FileClaim     from './pages/farmer/FileClaim.jsx';
import ClaimsHistory from './pages/farmer/ClaimsHistory.jsx';

// Provider pages
import ClientsList from './pages/provider/ClientsList.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true,      element: <Home /> },
      { path: 'home',     element: <Home /> },
      { path: 'about',    element: <About /> },
      { path: 'login',    element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: 'dashboard',     element: <Dashboard /> },
          // Farmer routes
          { path: 'my-policies',   element: <MyPolicies /> },
          { path: 'file-claim',    element: <FileClaim /> },
          { path: 'claims-history',element: <ClaimsHistory /> },
          // Provider routes
          { path: 'clients',       element: <ClientsList /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);