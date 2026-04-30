import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    const variants = {
      primary: "bg-[#6366F1] text-white hover:bg-[#4F46E5] rounded-lg px-4 py-2 font-medium",
      secondary: "bg-transparent border border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1]/10 rounded-lg px-4 py-2",
      ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg px-4 py-2",
      danger: "bg-[#EF4444] text-white hover:bg-red-600 rounded-lg px-4 py-2",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "transition-colors focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";