import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';
import { AuthResponse } from '../types';

interface AuthContextType {
  token: string | null;
  username: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('wasfati_token')
  );
  const [username, setUsername] = useState<string | null>(
    () => localStorage.getItem('wasfati_username')
  );
  const [role, setRole] = useState<string | null>(
    () => localStorage.getItem('wasfati_role')
  );

  const isAuthenticated = !!token;
  const isAdmin = role === 'ADMIN';

  const login = async (usernameInput: string, password: string) => {
    const res = await api.login(usernameInput, password);
    const data: AuthResponse = res.data;

    localStorage.setItem('wasfati_token', data.token);
    localStorage.setItem('wasfati_username', data.username);
    localStorage.setItem('wasfati_role', data.role);

    setToken(data.token);
    setUsername(data.username);
    setRole(data.role);
  };

  const logout = () => {
    localStorage.removeItem('wasfati_token');
    localStorage.removeItem('wasfati_username');
    localStorage.removeItem('wasfati_role');
    setToken(null);
    setUsername(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, username, role, isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
