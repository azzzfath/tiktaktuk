import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("bg-surface-dark rounded-xl border border-white/10 p-6", className)}
      {...props}
    />
  );
}
