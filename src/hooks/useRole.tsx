"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  ReactNode,
} from "react";
import {
  login as loginRequest,
  readStoredSession,
  register as registerRequest,
  writeStoredSession,
} from "@/lib/api";
import type { LoginPayload, RegisterPayload } from "@/lib/api";
import type { AuthSession, Role } from "@/types";

interface RoleContextValue {
  session: AuthSession | null;
  user: AuthSession["user"] | null;
  token: string | null;
  role: Role;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

const AUTH_EVENT = "tiktaktuk:auth-change";

const subscribeToAuth = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_EVENT, callback);
  };
};

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const session = useSyncExternalStore(subscribeToAuth, readStoredSession, () => null);

  const login = useCallback(async (payload: LoginPayload) => {
    const nextSession = await loginRequest(payload);
    writeStoredSession(nextSession);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const nextSession = await registerRequest(payload);
    writeStoredSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    writeStoredSession(null);
  }, []);

  const role: Role = session?.user.role ?? "guest";

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      token: session?.token ?? null,
      role,
      login,
      register,
      logout,
    }),
    [login, logout, register, role, session]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};
