import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

export function StatCard({ title, value, className }: StatCardProps) {
  return (
    <div className={cn("bg-surface-dark rounded-xl border border-white/10 p-6 flex flex-col gap-2", className)}>
      <h3 className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
        {title}
      </h3>
      <p className="text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}
