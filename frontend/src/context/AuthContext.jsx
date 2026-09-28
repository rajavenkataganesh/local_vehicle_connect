import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('lvc_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch (err) {
          console.error("Session expired or invalid token:", err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email_or_phone, password) => {
    const data = await authApi.login({ email_or_phone, password });
    localStorage.setItem('lvc_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const registerCustomer = async (formData) => {
    const data = await authApi.registerCustomer(formData);
    localStorage.setItem('lvc_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const registerDriver = async (formData) => {
    const data = await authApi.registerDriver(formData);
    localStorage.setItem('lvc_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('lvc_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        role: user?.role || null,
        isCustomer: user?.role === 'CUSTOMER',
        isDriver: user?.role === 'DRIVER',
        login,
        registerCustomer,
        registerDriver,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
