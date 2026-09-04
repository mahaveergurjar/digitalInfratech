import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_TOKEN = 'dit-admin-token';
const STORAGE_ADMIN = 'dit-admin-user';
import { API_URL } from '../config/api';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN));
  const [admin, setAdmin] = useState(() => {
    const stored = localStorage.getItem(STORAGE_ADMIN);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem(STORAGE_TOKEN, token);
    else localStorage.removeItem(STORAGE_TOKEN);
  }, [token]);

  useEffect(() => {
    if (admin) localStorage.setItem(STORAGE_ADMIN, JSON.stringify(admin));
    else localStorage.removeItem(STORAGE_ADMIN);
  }, [admin]);

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    setToken(data.token);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
  };

  const value = useMemo(() => ({ token, admin, login, logout, isAdmin: Boolean(token) }), [token, admin]);

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

export function adminFetch(path, token, options = {}) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}
