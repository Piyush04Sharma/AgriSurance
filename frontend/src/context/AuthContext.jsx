import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the Context object
const AuthContext = createContext();

// 2. Create the Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // <-- NEW STATE: Storing the token
  const [loading, setLoading] = useState(true);

  // Check for token on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // In a real app, you would validate the token with the backend here.
      // For now, we assume token presence means logged in.
      setIsAuthenticated(true);
      setToken(storedToken); // <-- SETTING NEW STATE
      // You would decode the token to get user data or fetch user data here.
      setUser({ name: 'User' }); 
    }
    setLoading(false);
  }, []);

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null); // <-- CLEARING TOKEN STATE
  };

  // The values passed down to consumers
  const contextValue = {
    isAuthenticated,
    user,
    token, // <-- NEW VALUE: Exporting the token state
    loading,
    setIsAuthenticated,
    setUser,
    setToken, // <-- NEW SETTER: Allows Login.jsx to update the token state
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook for easy context consumption
export const useAuth = () => {
  return useContext(AuthContext);
};