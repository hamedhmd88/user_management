import React, {
  createContext, useCallback, useContext,
  useEffect, useMemo, useState,
} from "react";
import { authService } from "../services/authService";

interface AuthState {
  user: { token: string } | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
}

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<AuthState["user"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) setUser({ token });
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { data } = await authService.login(username, password);
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    setUser({ token: data.access });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx)!;