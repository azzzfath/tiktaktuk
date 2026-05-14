"use client";

import { TicketCategory } from "@/types";
import { formatIDR } from "@/lib/format";
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  categories: TicketCategory[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export const CategorySelector = ({ categories, selectedId, onSelect }: CategorySelectorProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-semibold text-[#F4F4F5]">Pilih Kategori Tiket</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((cat) => {
          const selected = cat.id === selectedId;
          const soldOut = cat.remaining === 0;
          return (
            <button
              key={cat.id}
              type="button"
              disabled={soldOut}
              onClick={() => cat.id && onSelect(cat.id)}
              className={cn(
                "flex flex-col gap-2 text-left p-4 rounded-lg border transition-colors",
                selected
                  ? "border-[#6366F1] bg-[#6366F1]/10 ring-2 ring-[#6366F1]/40"
                  : "border-white/10 bg-[#1A1A1A] hover:border-white/20",
                soldOut && "opacity-40 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-[#F4F4F5]">{cat.name}</span>
                {soldOut ? (
                  <span className="text-xs font-medium text-[#EF4444]">Sold out</span>
                ) : (
                  <span className="text-xs font-medium text-zinc-400">
                    Sisa {cat.remaining}
                  </span>
                )}
              </div>
              <span className="text-lg font-bold text-[#6366F1]">{formatIDR(cat.price)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
