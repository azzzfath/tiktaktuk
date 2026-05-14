"use client";

import { ReactNode } from "react";
import { RoleProvider } from "@/hooks/useRole";
import { ToastProvider } from "@/hooks/useToast";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <RoleProvider>
      <ToastProvider>{children}</ToastProvider>
    </RoleProvider>
  );
};
