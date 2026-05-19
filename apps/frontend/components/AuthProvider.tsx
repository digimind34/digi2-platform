"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

import {
  apiRequest,
  clearStoredTokens,
  getCurrentUser,
  loginUser,
  refreshStoredAccessToken,
} from "@/lib/api";
import type { LoginData, UserProfile } from "@/lib/api";

type AuthContextValue = {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  reloadProfile: () => Promise<UserProfile>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const reloadProfile = useCallback(async () => {
    const profile = await getCurrentUser();
    setUser(profile);
    return profile;
  }, []);

  const refreshSession = useCallback(async () => {
    const refreshed = await refreshStoredAccessToken();

    if (!refreshed) {
      setUser(null);
      return false;
    }

    await reloadProfile();
    return true;
  }, [reloadProfile]);

  useEffect(() => {
    let isActive = true;

    async function bootstrapAuth() {
      try {
        // Fetch the CSRF cookie first to ensure secure POST requests are allowed
        await apiRequest("/api/auth/csrf/", {}, false);

        // getCurrentUser() uses apiRequest, which will automatically attempt 
        // to refresh the HttpOnly cookie token if it returns a 401 Unauthorized.
        const profile = await getCurrentUser();

        if (isActive) {
          setUser(profile);
        }
      } catch {
        if (isActive) {
          setUser(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      isActive = false;
    };
  }, []);

  const login = useCallback(
    async (data: LoginData) => {
      await loginUser(data);
      return reloadProfile();
    },
    [reloadProfile],
  );

  const logout = useCallback(async () => {
    await clearStoredTokens();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refreshSession,
      reloadProfile,
    }),
    [loading, login, logout, refreshSession, reloadProfile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
