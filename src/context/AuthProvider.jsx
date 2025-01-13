import React, { useState, useEffect, createContext, useContext } from 'react';
import axiosInstance from '../components/api/AuthApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedRefreshToken = localStorage.getItem('refresh_token');
      if (storedRefreshToken) {
        setRefreshToken(storedRefreshToken);
        try {
          const response = await axiosInstance.post('/auth/refresh-token', { refreshToken: storedRefreshToken });
          const { access_token, user: userData } = response.data;
          setAccessToken(access_token);
          setUser(userData);
        } catch (error) {
          console.error('Failed to refresh token:', error);
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('/api/login', credentials);
      const { access_token, refresh_token, ...userData } = response.data.data;
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      localStorage.setItem('refresh_token', refresh_token);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('refresh_token');
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });
      const { access_token } = response.data;
      setAccessToken(access_token);
      return access_token;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, accessToken, login, logout, loading, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;