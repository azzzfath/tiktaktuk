import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "default" | "muted";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50",
        {
          "bg-primary/20 text-primary": variant === "primary",
          "bg-secondary/20 text-secondary": variant === "secondary",
          "bg-success/20 text-success": variant === "success",
          "bg-warning/20 text-warning": variant === "warning",
          "bg-error/20 text-error": variant === "error",
          "bg-zinc-800 text-zinc-300": variant === "default",
          "bg-zinc-800/50 text-zinc-400": variant === "muted",
        },
        className
      )}
      {...props}
    />
  );
}
