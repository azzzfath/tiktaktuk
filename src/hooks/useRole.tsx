"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  ReactNode,
} from "react";
import { Role } from "@/types";

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

const STORAGE_KEY = "tiktaktuk:role";
const STORAGE_EVENT = "tiktaktuk:role-change";
const DEFAULT_ROLE: Role = "customer";

const readRole = (): Role => {
  if (typeof window === "undefined") return DEFAULT_ROLE;

  return (window.localStorage.getItem(STORAGE_KEY) as Role | null) ?? DEFAULT_ROLE;
};

const subscribeToRole = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
};

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const role = useSyncExternalStore(subscribeToRole, readRole, () => DEFAULT_ROLE);

  const setRole = useCallback((next: Role) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }, []);

  const value = useMemo(() => ({ role, setRole }), [role, setRole]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};
