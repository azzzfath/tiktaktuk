"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-full max-w-sm">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const config = {
    success: { Icon: CheckCircle2, color: "text-[#22C55E]", border: "border-[#22C55E]/40" },
    error: { Icon: AlertCircle, color: "text-[#EF4444]", border: "border-[#EF4444]/40" },
    info: { Icon: Info, color: "text-[#06B6D4]", border: "border-[#06B6D4]/40" },
  }[toast.variant];

  const { Icon, color, border } = config;

  return (
    <div
      className={cn(
        "flex items-start gap-3 bg-[#1A1A1A] border rounded-lg p-4 shadow-2xl animate-in fade-in slide-in-from-top-2",
        border
      )}
    >
      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", color)} />
      <p className="flex-1 text-sm text-[#F4F4F5]">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="text-zinc-500 hover:text-white transition-colors"
        aria-label="Tutup notifikasi"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
};
