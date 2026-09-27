import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('twu_admin_user');
    return saved ? JSON.parse(saved) : {
      id: 1,
      name: 'SuperAdmin Operations',
      email: 'superadmin@travelwithus.com',
      role: 'ROLE_SUPER_ADMIN'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('twu_admin_token') || 'demo-admin-jwt-token');

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('twu_admin_user', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('twu_admin_user');
    }
  }, [adminUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('twu_admin_token', token);
    } else {
      localStorage.removeItem('twu_admin_token');
    }
  }, [token]);

  const login = (email, password) => {
    const userObj = {
      id: 1,
      name: email.includes('superadmin') ? 'SuperAdmin Operations' : 'Admin Operations',
      email,
      role: email.includes('superadmin') ? 'ROLE_SUPER_ADMIN' : 'ROLE_ADMIN'
    };
    setAdminUser(userObj);
    setToken('authenticated-admin-token');
    return userObj;
  };

  const logout = () => {
    setAdminUser(null);
    setToken(null);
    localStorage.removeItem('twu_admin_token');
    localStorage.removeItem('twu_admin_user');
  };

  return (
    <AdminAuthContext.Provider value={{
      adminUser,
      token,
      isAuthenticated: Boolean(adminUser && token),
      login,
      logout
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return context;
};
