// import { Link, Outlet } from 'react-router-dom';
// import { useAuth } from './context/AuthContext.jsx'; 
// import { useNavigate } from 'react-router-dom'; 
// import React, { useState } from 'react'; 
// // *** ASSUMPTION: You should import your image file here ***
// // import dashboardImg from './assets/dashboard.jpg'; 

// function App() {
//     const { isAuthenticated, logout, user } = useAuth(); 
//     const navigate = useNavigate();
//     const [showProfileMenu, setShowProfileMenu] = useState(false); 

//     const handleLogout = () => {
//         logout(); 
//         navigate('/login');
//     };
//     
//     // --- Header Styling (Inlined for reliability) ---
//     const headerStyle = {
//         padding: '15px 30px',
//         backgroundColor: '#55483a', /* Dark Brown */
//         borderBottom: '5px solid #d4a948', /* Gold accent */
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         boxShadow: '0 4px 10px rgba(0, 0, 0, 0.7)',
//         zIndex: 100,
//         height: '80px', /* Fixed height for clean look */
//     };

//     // --- Logo Styling (Inlined for reliability) ---
//     const logoStyle = {
//         color: '#fff',
//         fontSize: '2em',
//         letterSpacing: '1px',
//         transition: 'color 0.3s ease',
//     };

//     // --- Main Content Area Styling (Inlined for reliability) ---
//     const mainStyle = {
//         padding: '0',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'flex-start', /* FIX: Ensures content starts at the top */
//         flexGrow: 1,
//         width: '100%',
//         minHeight: 'calc(100vh - 80px - 38px)' /* Full height minus header and footer */
//     };
    
//     // New Component: Profile Menu Dropdown
//     const ProfileMenu = () => (
//         <div 
//             onMouseLeave={() => setShowProfileMenu(false)}
//             style={{ 
//                 position: 'absolute', 
//                 right: '25px', 
//                 top: '80px', /* Adjusted for new header height */
//                 backgroundColor: '#55483a', 
//                 border: '1px solid #d4a948', 
//                 borderRadius: '5px',
//                 boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
//                 zIndex: 100, 
//                 width: '180px'
//             }}
//         >
//             {/* User Info Line */}
//             <div style={{ padding: '10px 15px', color: '#fff', borderBottom: '1px solid #444', fontSize: '0.9em' }}>
//                 Welcome, {user?.name || 'User'}
//             </div>
//             
//             {/* Profile Link */}
//             <Link 
//                 to="/profile" 
//                 onClick={() => setShowProfileMenu(false)}
//                 style={{ display: 'block', padding: '10px 15px', color: '#f0e6d6', textDecoration: 'none', margin: '0' }}
//             >
//                 Your Profile
//             </Link>
//             
//             {/* Logout Link */}
//             <a 
//                 href="#" 
//                 onClick={handleLogout} 
//                 style={{ display: 'block', padding: '10px 15px', color: '#d4a948', textDecoration: 'none', margin: '0', borderTop: '1px solid #444' }}
//             >
//                 Logout
//             </a>
//         </div>
//     );

//     return (
//         /* --- FINAL BACKGROUND FIX: Using background image style inline --- */
//         <div 
//             className="dashboard-bg" 
//             style={{ 
//                 position: 'relative', 
//                 minHeight: '100vh', 
//                 width: '100%',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 // *** Image Path: Update this line if your path is different ***
//                 backgroundImage: `url(./assets/dashboard.jpg)`,
//                 backgroundSize: 'cover',
//                 backgroundAttachment: 'fixed',
//                 backgroundColor: '#1a1a1a', /* Fallback color */
//             }}
//         > 
//             <header style={headerStyle}>
//                 <div className="logo">
//                     {/* Applying interactive hover logic inline */}
//                     <h1 
//                         style={logoStyle}
//                         onMouseEnter={(e) => e.target.style.color = '#d4a948'}
//                         onMouseLeave={(e) => e.target.style.color = '#fff'}
//                     >
//                         AgriSurance
//                     </h1>
//                 </div>
//                 
//                 <nav className="main-nav">
//                     {/* Navigation Link Styling (using existing CSS logic) */}
//                     <Link to="/home" style={{ color: '#f0e6d6', textDecoration: 'none', marginLeft: '25px' }}>Home</Link> |{' '}
//                     <Link to="/about" style={{ color: '#f0e6d6', textDecoration: 'none', marginLeft: '25px' }}>About</Link> |{' '}
//                     
//                     {isAuthenticated ? (
//                         <>
//                             <Link to="/dashboard" style={{ color: '#f0e6d6', textDecoration: 'none', marginLeft: '25px' }}>Dashboard</Link> |{' '}
//                             
//                             {/* --- Profile Dropdown Button --- */}
//                             <a 
//                                 href="#" 
//                                 onClick={() => setShowProfileMenu(!showProfileMenu)} 
//                                 onMouseEnter={() => setShowProfileMenu(true)} 
//                                 style={{ 
//                                     marginLeft: '25px', 
//                                     color: '#fff', 
//                                     cursor: 'pointer', 
//                                     fontWeight: 'bold',
//                                     textDecoration: 'none' 
//                                 }}
//                             >
//                                 Profile ▼
//                             </a>
//                         </>
//                     ) : (
//                         <>
//                             <Link to="/login" style={{ color: '#f0e6d6', textDecoration: 'none', marginLeft: '25px' }}>Login</Link> |{' '}
//                             <Link to="/register" style={{ color: '#f0e6d6', textDecoration: 'none', marginLeft: '25px' }}>Register</Link>
//                         </>
//                     )}
//                 </nav>
//             </header>

//             {/* Render Profile Menu only when triggered */}
//             {showProfileMenu && isAuthenticated && <ProfileMenu />} 
//             
//             {/* Main Content Rendered Here */}
//             <main style={mainStyle}>
//                 <div className="content-wrapper" style={{ width: '100%' }}>
//                     <Outlet />
//                 </div>
//             </main>
//             
//             {/* Footer */}
//             <footer style={{ textAlign: 'center', padding: '10px 0', backgroundColor: 'rgba(30, 30, 30, 0.9)', color: '#999', width: '100%', fontSize: '0.8em' }}>
//                 <p>&copy; 2025</p>
//             </footer>
//         </div>
//     );
// }

// export default App;

import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';

function App() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setShowProfileMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname === `/${path}`;

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="app-wrapper">
      {/* ── NAVBAR ── */}
      <nav className="navbar" style={{
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
        borderBottomColor: scrolled ? 'rgba(201,153,58,0.3)' : 'rgba(201,153,58,0.15)',
      }}>
        {/* Brand */}
        <Link to="/home" className="navbar-brand">
          <div className="navbar-logo-icon">🌾</div>
          <span className="navbar-logo-text">Agri<span>Surance</span></span>
        </Link>

        {/* Links */}
        <ul className="navbar-links">
          <li>
            <Link to="/home" className={`nav-link ${isActive('home') || location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className={`nav-link ${isActive('about') ? 'active' : ''}`}>
              About
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link to="/dashboard" className={`nav-link ${isActive('dashboard') ? 'active' : ''}`}>
                  Dashboard
                </Link>
              </li>
              {/* Profile Dropdown */}
              <li className="profile-dropdown-wrapper" ref={dropdownRef}>
                <button
                  className="profile-trigger"
                  onClick={() => setShowProfileMenu(v => !v)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
                >
                  <div className="profile-avatar">{getUserInitials()}</div>
                  <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.7, transition: 'transform 0.2s', transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                </button>

                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <div className="name">{user?.name || 'User'}</div>
                      <div className="role">{user?.role || 'Member'}</div>
                    </div>
                    <Link to="/dashboard" className="dropdown-item">
                      <span>📊</span> Dashboard
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="nav-btn nav-btn-outline" style={{ marginLeft: '0.5rem' }}>
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="nav-btn nav-btn-solid" style={{ marginLeft: '0.5rem' }}>
                  Get Started
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* ── FOOTER ── */}
      <footer className="app-footer">
        <span className="footer-text">© 2025 AgriSurance · Protecting Every Harvest</span>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
