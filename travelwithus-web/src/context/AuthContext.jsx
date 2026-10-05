import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Start with saved user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('twu_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      const savedToken = localStorage.getItem('twu_token');
      if (savedToken) return savedToken;
      const savedUser = localStorage.getItem('twu_user');
      return savedUser ? 'jwt-token-active' : null;
    } catch {
      return null;
    }
  });

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
    const loggedUser = {
      id: res.userId,
      name: (res.firstName || res.lastName) ? `${res.firstName || ''} ${res.lastName || ''}`.trim() : (res.name || email.split('@')[0]),
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email || email,
      role: (res.roles && res.roles[0]) || res.role || 'ROLE_USER',
      provider: 'LOCAL'
    };
    const activeToken = res.accessToken || res.token || 'jwt-token-active';
    localStorage.setItem('twu_user', JSON.stringify(loggedUser));
    localStorage.setItem('twu_token', activeToken);
    setUser(loggedUser);
    setToken(activeToken);
    setAuthModalOpen(false);
    return res;
  };

  const register = async (formData) => {
    const res = await api.register(formData);
    const registeredUser = {
      id: res.userId,
      name: (res.firstName || res.lastName) ? `${res.firstName || ''} ${res.lastName || ''}`.trim() : (formData.fullName || 'Traveler'),
      firstName: res.firstName,
      lastName: res.lastName,
      email: res.email || formData.email,
      role: (res.roles && res.roles[0]) || 'ROLE_USER',
      provider: 'LOCAL'
    };
    const activeToken = res.accessToken || res.token || 'jwt-token-active';
    localStorage.setItem('twu_user', JSON.stringify(registeredUser));
    localStorage.setItem('twu_token', activeToken);
    setUser(registeredUser);
    setToken(activeToken);
    setAuthModalOpen(false);
    return res;
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem('twu_user', JSON.stringify(merged));
      return merged;
    });
  };

  const oauthLogin = async (oauthData) => {
    if (oauthData.token) {
      const loggedUser = {
        id: oauthData.userId || Math.floor(Math.random() * 1000) + 1,
        name: oauthData.name || 'Google Traveler',
        email: oauthData.email,
        role: oauthData.role || 'ROLE_CUSTOMER',
        avatarUrl: oauthData.avatarUrl,
        provider: 'GOOGLE'
      };
      localStorage.setItem('twu_user', JSON.stringify(loggedUser));
      localStorage.setItem('twu_token', oauthData.token);
      setUser(loggedUser);
      setToken(oauthData.token);
      setAuthModalOpen(false);
      return loggedUser;
    }

    const res = await api.oauthLogin(oauthData);
    const loggedUser = {
      id: res.userId || Math.floor(Math.random() * 1000) + 1,
      name: res.name || (res.firstName ? `${res.firstName || ''} ${res.lastName || ''}`.trim() : oauthData.name || 'Traveler'),
      email: res.email || oauthData.email,
      role: (res.roles && res.roles[0]) || res.role || 'ROLE_CUSTOMER',
      avatarUrl: res.avatarUrl || oauthData.avatarUrl,
      provider: (res.provider || oauthData.provider || 'OAUTH2').toUpperCase(),
      ssoDomain: oauthData.ssoDomain || res.ssoDomain
    };
    const activeToken = res.accessToken || res.token || 'jwt-token-oauth-active';
    localStorage.setItem('twu_user', JSON.stringify(loggedUser));
    localStorage.setItem('twu_token', activeToken);
    setUser(loggedUser);
    setToken(activeToken);
    setAuthModalOpen(false);
    return loggedUser;
  };

  const mobileLogin = async (phoneNumber, otp) => {
    const res = await api.mobileLogin(phoneNumber, otp);
    const loggedUser = {
      id: res.userId || Math.floor(Math.random() * 1000) + 1,
      name: res.name || `Traveler (${phoneNumber.slice(-4)})`,
      email: res.email || `${phoneNumber.replace(/[^0-9]/g, '')}@mobile.travelwithus.com`,
      phoneNumber: phoneNumber,
      role: (res.roles && res.roles[0]) || res.role || 'ROLE_CUSTOMER',
      provider: 'MOBILE'
    };
    const activeToken = res.accessToken || res.token || 'jwt-token-mobile-active';
    localStorage.setItem('twu_user', JSON.stringify(loggedUser));
    localStorage.setItem('twu_token', activeToken);
    setUser(loggedUser);
    setToken(activeToken);
    setAuthModalOpen(false);
    return loggedUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('twu_token');
    localStorage.removeItem('twu_user');
    sessionStorage.clear();
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
      isAuthenticated: Boolean(user),
      login,
      register,
      updateUser,
      oauthLogin,
      mobileLogin,
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

