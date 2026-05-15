import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-lg px-4 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none",
        {
          "bg-primary text-white hover:bg-[#4F46E5]": variant === "primary",
          "bg-transparent border border-primary text-primary hover:bg-primary/10":
            variant === "secondary",
          "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5":
            variant === "ghost",
          "bg-error text-white hover:bg-red-600": variant === "danger",
        },
        className
      )}
      {...props}
    />
  );
}
