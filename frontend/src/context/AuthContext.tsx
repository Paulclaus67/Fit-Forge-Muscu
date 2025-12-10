// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';
import type { User } from '../api/auth';
import { login as apiLogin, register as apiRegister } from '../api/auth';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize state from localStorage using lazy initialization
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { user: User; token: string };
        return parsed.user;
      } catch {
        localStorage.removeItem('auth');
      }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { user: User; token: string };
        return parsed.token;
      } catch {
        // Already removed in user initialization
      }
    }
    return null;
  });

  const loading = false;

  const saveAuth = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('auth', JSON.stringify({ user, token }));
  };

  const login = async (emailOrUsername: string, password: string) => {
    const res = await apiLogin(emailOrUsername, password);
    saveAuth(res.user, res.token);
  };

  const register = async (email: string, username: string, password: string) => {
    const res = await apiRegister(email, username, password);
    saveAuth(res.user, res.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    if (token) {
      localStorage.setItem('auth', JSON.stringify({ user: updatedUser, token }));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
