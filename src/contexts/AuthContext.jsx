import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = useMemo(() => !!user, [user]);

  // Restore user from token when app first loads
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    authService
      .getMe()
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem('accessToken');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Poll /api/auth/me every 30s to detect session invalidation (e.g. admin reset password)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const data = await authService.getMe();
        // Update user data (e.g. mustChangePassword flag changes)
        setUser(data);
      } catch (err) {
        // If 401, the axios interceptor in api.js will handle redirect to /login
        // We just clear the interval to stop further polling
        if (err.response?.status === 401) {
          clearInterval(interval);
        }
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [!!user]); // Only re-run when user changes between null <-> non-null

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    let userData = data?.user || null;

    if (!userData) {
      try {
        userData = await authService.getMe();
      } catch {
        userData = { email: credentials.email, role: data?.role };
      }
    }

    setUser(userData);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await authService.getMe();
      setUser(data);
    } catch {
      // silently fail — keep existing user
    }
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated, isLoading, login, logout, setUser, refreshUser }),
    [user, isAuthenticated, isLoading, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
