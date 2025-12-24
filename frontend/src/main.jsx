import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// --- CRITICAL FIX: Ensure index.css is imported first ---
import './index.css'; 

// --- Application Components and Context ---
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; 

// --- Page and Component Imports ---
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx'; 
import PrivateRoute from './components/PrivateRoute.jsx'; 


// 1. Define the Routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, 
    children: [
      // Public Routes
      { index: true, element: <Home /> },
      { path: 'home', element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      
      // --- PRIVATE ROUTE WRAPPER ---
      {
        element: <PrivateRoute />, 
        children: [
          {
            path: 'dashboard', 
            element: <Dashboard />, 
          },
        ],
      },
    ],
  },
]);

// 2. Render the Router, wrapped in the AuthProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);