import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "muted";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    const variants = {
      primary: "bg-[#6366F1]/20 text-[#6366F1]",
      secondary: "bg-[#8B5CF6]/20 text-[#8B5CF6]",
      accent: "bg-[#06B6D4]/20 text-[#06B6D4]",
      success: "bg-green-500/20 text-green-500",
      warning: "bg-amber-500/20 text-amber-500",
      error: "bg-[#EF4444]/20 text-[#EF4444]",
      muted: "bg-zinc-500/20 text-zinc-500",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";