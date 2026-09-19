import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { API_URL } from '../config/api';
import { DEV_ADMIN, isDevAdminToken, parseJsonResponse, parseStoredJson } from '../utils/http';

const STORAGE_TOKEN = 'dit-admin-token';
const STORAGE_ADMIN = 'dit-admin-user';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN));
  const [admin, setAdmin] = useState(() => parseStoredJson(localStorage.getItem(STORAGE_ADMIN)));

  useEffect(() => {
    if (token) localStorage.setItem(STORAGE_TOKEN, token);
    else localStorage.removeItem(STORAGE_TOKEN);
  }, [token]);

  useEffect(() => {
    if (admin) localStorage.setItem(STORAGE_ADMIN, JSON.stringify(admin));
    else localStorage.removeItem(STORAGE_ADMIN);
  }, [admin]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const { data, parseError } = await parseJsonResponse(response);

      if (data && response.ok) {
        setToken(data.token);
        setAdmin(data.admin);
        return data;
      }

      if (import.meta.env.DEV && email === DEV_ADMIN.email && password === DEV_ADMIN.password) {
        const devAdmin = { email, name: 'Admin', role: 'admin' };
        setToken(DEV_ADMIN.token);
        setAdmin(devAdmin);
        return { token: DEV_ADMIN.token, admin: devAdmin };
      }

      throw new Error(data?.message || parseError || 'Login failed');
    } catch (error) {
      if (import.meta.env.DEV && email === DEV_ADMIN.email && password === DEV_ADMIN.password) {
        const devAdmin = { email, name: 'Admin', role: 'admin' };
        setToken(DEV_ADMIN.token);
        setAdmin(devAdmin);
        return { token: DEV_ADMIN.token, admin: devAdmin };
      }

      throw new Error(
        error.message === 'Failed to fetch'
          ? 'Cannot reach API. In local dev use admin@digitalinfratech.in / admin123'
          : error.message || 'Login failed'
      );
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
  };

  const value = useMemo(
    () => ({ token, admin, login, logout, isAdmin: Boolean(token) }),
    [token, admin]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

export function adminFetch(path, token, options = {}) {
  if (isDevAdminToken(token)) {
    return Promise.resolve({
      ok: false,
      status: 503,
      json: async () => ({ success: false, message: 'API not available in local dev mode' }),
      text: async () => '',
    });
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}
