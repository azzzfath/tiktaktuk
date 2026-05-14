"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityCounterProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export const QuantityCounter = ({ value, min = 1, max = 10, onChange }: QuantityCounterProps) => {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-[#F4F4F5]">Jumlah Tiket</h3>
        <span className="text-xs text-zinc-500">Maks. {max} per transaksi</span>
      </div>
      <div className="inline-flex items-center gap-3 bg-[#1A1A1A] border border-white/10 rounded-lg p-1 w-fit">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          className={cn(
            "h-9 w-9 inline-flex items-center justify-center rounded-md text-zinc-300 hover:bg-white/10 transition-colors",
            value <= min && "opacity-40 cursor-not-allowed"
          )}
          aria-label="Kurangi jumlah"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="min-w-8 text-center text-lg font-semibold text-[#F4F4F5]">{value}</span>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          className={cn(
            "h-9 w-9 inline-flex items-center justify-center rounded-md text-zinc-300 hover:bg-white/10 transition-colors",
            value >= max && "opacity-40 cursor-not-allowed"
          )}
          aria-label="Tambah jumlah"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
