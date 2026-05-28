import { createContext, useState, useCallback, useEffect } from 'react';
import { authAPI, tokenManager } from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenManager.getUser());
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // On mount: validate token and fetch fresh user data
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenManager.getAccessToken();
      if (token && !tokenManager.isTokenExpired()) {
        try {
          const response = await authAPI.getMe();
          const userData = response.data.user;
          setUser(userData);
          tokenManager.setUser(userData);
        } catch {
          // Token invalid — clear auth
          tokenManager.clearAll();
          setUser(null);
        }
      } else if (token && tokenManager.isTokenExpired()) {
        // Try to refresh
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          try {
            const response = await authAPI.refresh(refreshToken);
            tokenManager.setTokens(response.data.accessToken, response.data.refreshToken);
            const meResponse = await authAPI.getMe();
            const userData = meResponse.data.user;
            setUser(userData);
            tokenManager.setUser(userData);
          } catch {
            tokenManager.clearAll();
            setUser(null);
          }
        } else {
          tokenManager.clearAll();
          setUser(null);
        }
      }
      setInitialLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const { user: userData, accessToken, refreshToken } = response.data;

      tokenManager.setTokens(accessToken, refreshToken);
      tokenManager.setUser(userData);
      setUser(userData);
      setLoading(false);
      return userData;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    try {
      const response = await authAPI.register(userData);
      const { user: newUser, accessToken, refreshToken } = response.data;

      tokenManager.setTokens(accessToken, refreshToken);
      tokenManager.setUser(newUser);
      setUser(newUser);
      setLoading(false);
      return newUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      // Continue with local logout even if API fails
    }
    tokenManager.clearAll();
    setUser(null);
  }, []);

  const logoutAll = useCallback(async () => {
    try {
      await authAPI.logoutAll();
    } catch {
      // Continue with local logout
    }
    tokenManager.clearAll();
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedData) => {
    const updated = { ...user, ...updatedData };
    setUser(updated);
    tokenManager.setUser(updated);
  }, [user]);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isEmailVerified = user?.emailVerified === true;

  return (
    <AuthContext.Provider value={{
      user, login, register, logout, logoutAll, updateUser,
      loading, initialLoading,
      isAuthenticated, isAdmin, isEmailVerified,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
