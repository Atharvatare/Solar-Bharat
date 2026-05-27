import { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

const MOCK_USERS = {
  user: {
    id: '1',
    name: 'Arjun Sharma',
    email: 'arjun@solarbharat.in',
    role: 'user',
    avatar: null,
    phone: '+91 98765 43210',
    location: 'Mumbai, Maharashtra',
    joinedDate: '2024-06-15',
    solarSystem: {
      capacity: '5kW',
      panels: 12,
      installedDate: '2024-07-20'
    }
  },
  admin: {
    id: '0',
    name: 'Admin',
    email: 'admin@solarbharat.in',
    role: 'admin',
    avatar: null,
    phone: '+91 99999 00000',
    location: 'New Delhi',
    joinedDate: '2024-01-01',
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('solar-bharat-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    let mockUser;
    if (email.includes('admin')) {
      mockUser = MOCK_USERS.admin;
    } else {
      mockUser = { ...MOCK_USERS.user, email };
    }
    
    setUser(mockUser);
    localStorage.setItem('solar-bharat-user', JSON.stringify(mockUser));
    setLoading(false);
    return mockUser;
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser = {
      ...MOCK_USERS.user,
      ...userData,
      id: Date.now().toString(),
      joinedDate: new Date().toISOString().split('T')[0],
    };
    
    setUser(newUser);
    localStorage.setItem('solar-bharat-user', JSON.stringify(newUser));
    setLoading(false);
    return newUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('solar-bharat-user');
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, login, register, logout, loading,
      isAuthenticated, isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
}
