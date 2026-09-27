import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('twu_user');
    return saved ? JSON.parse(saved) : { id: 1, name: 'Alex Mercer', email: 'alex.mercer@travelwithus.com', role: 'ROLE_CUSTOMER' };
  });

  const [token, setToken] = useState(() => localStorage.getItem('twu_token') || 'demo-jwt-token');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    if (user) {
      localStorage.setItem('twu_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('twu_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('twu_token', token);
    } else {
      localStorage.removeItem('twu_token');
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setUser({ id: res.userId || 1, name: res.name || 'Traveler', email, role: res.role || 'ROLE_CUSTOMER' });
    setToken(res.token || 'jwt-token-active');
    setAuthModalOpen(false);
    return res;
  };

  const register = async (formData) => {
    const res = await api.register(formData);
    setUser({ id: res.userId || 2, name: formData.fullName, email: formData.email, role: 'ROLE_CUSTOMER' });
    setToken(res.token || 'jwt-token-active');
    setAuthModalOpen(false);
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('twu_token');
    localStorage.removeItem('twu_user');
  };

  const openAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => setAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      authModalOpen,
      authModalMode,
      openAuth,
      closeAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
