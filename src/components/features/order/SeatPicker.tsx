"use client";

import { Seat } from "@/types";
import { cn } from "@/lib/utils";

interface SeatPickerProps {
  seats: Seat[];
  selectedIds: string[];
  maxSelectable: number;
  onToggle: (id: string) => void;
  filterCategoryId?: string | null;
}

export const SeatPicker = ({
  seats,
  selectedIds,
  maxSelectable,
  onToggle,
  filterCategoryId,
}: SeatPickerProps) => {
  const visible = filterCategoryId ? seats.filter((s) => s.categoryId === filterCategoryId) : seats;

  const rows = Array.from(new Set(visible.map((s) => s.label.charAt(0))));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-[#F4F4F5]">Pilih Kursi (Opsional)</h3>
        <span className="text-xs text-zinc-500">
          {selectedIds.length} / {maxSelectable} terpilih
        </span>
      </div>

      <div className="bg-[#1A1A1A] rounded-lg border border-white/10 p-4 flex flex-col gap-3">
        <div className="flex items-center justify-center gap-4 text-xs text-zinc-500 pb-2 border-b border-white/5">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-[#1A1A1A] border border-white/20" /> Tersedia
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-[#6366F1]" /> Dipilih
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-zinc-700" /> Tidak tersedia
          </span>
        </div>

        {rows.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-4">
            Pilih kategori terlebih dahulu untuk melihat kursi.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-2">
                <span className="w-6 text-xs font-semibold text-zinc-500">{row}</span>
                <div className="flex flex-wrap gap-1.5">
                  {visible
                    .filter((s) => s.label.startsWith(row))
                    .map((seat) => {
                      const selected = selectedIds.includes(seat.id);
                      const disabled =
                        !seat.available || (!selected && selectedIds.length >= maxSelectable);
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          onClick={() => onToggle(seat.id)}
                          disabled={disabled && !selected}
                          aria-pressed={selected}
                          className={cn(
                            "h-9 w-10 rounded text-xs font-medium transition-colors",
                            !seat.available && "bg-zinc-800 text-zinc-600 cursor-not-allowed",
                            seat.available && !selected && "bg-[#0F0F0F] border border-white/10 text-zinc-300 hover:border-[#6366F1]/60",
                            selected && "bg-[#6366F1] text-white",
                            disabled && !selected && "opacity-40 cursor-not-allowed"
                          )}
                        >
                          {seat.label}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
