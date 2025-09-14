import React, { createContext, useContext, useMemo, useRef, useState, useEffect } from 'react';
import api, { handleApiError, authAPI } from '../services/api';
import { setAccessToken, clearAccessToken } from '../services/token';

const AuthContext = createContext(null);

// Access token is stored in services/token.js

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const hasTriedRefresh = useRef(false);

  // Silent refresh on initial load to keep SPA logged in after reload
  useEffect(() => {
    const run = async () => {
      if (hasTriedRefresh.current) return;
      hasTriedRefresh.current = true;
      try {
        const res = await api.post('/auth/refresh-token', {}, { withCredentials: true });
        if (res.data?.accessToken) {
          setAccessToken(res.data.accessToken);
          // Populate current user after obtaining new access token
          try {
            const meRes = await authAPI.me();
            setUser(meRes.data?.user ?? meRes.data ?? null);
          } catch (_) {
            // ignore if /me fails; user remains null
          }
        }
      } catch (_) {
        // ignore; user not logged in
      } finally {
        setAuthReady(true);
      }
    };
    run();
  }, []);

  const login = async (email, password, remember = true) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password, remember }, { withCredentials: true });
      setAccessToken(res.data.accessToken);
      try {
        const meRes = await authAPI.me();
        setUser(meRes.data?.user ?? meRes.data ?? res.data.user ?? null);
      } catch (_) {
        setUser(res.data.user ?? null);
      }
      return { ok: true };
    } catch (err) {
      return { ok: false, error: handleApiError(err) };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password }, { withCredentials: true });
      setAccessToken(res.data.accessToken);
      try {
        const meRes = await authAPI.me();
        setUser(meRes.data?.user ?? meRes.data ?? res.data.user ?? null);
      } catch (_) {
        setUser(res.data.user ?? null);
      }
      return { ok: true };
    } catch (err) {
      return { ok: false, error: handleApiError(err) };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
    } catch (_) {}
    clearAccessToken();
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, authReady, login, register, logout }), [user, loading, authReady]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
