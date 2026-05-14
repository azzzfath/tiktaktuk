"use client";

import { Promotion, TicketCategory } from "@/types";
import { Button } from "@/components/ui/Button";
import { formatIDR } from "@/lib/format";

interface OrderSummaryProps {
  category: TicketCategory | null;
  quantity: number;
  serviceFee: number;
  promo: Promotion | null;
  disabled: boolean;
  onSubmit: () => void;
}

export const OrderSummary = ({
  category,
  quantity,
  serviceFee,
  promo,
  disabled,
  onSubmit,
}: OrderSummaryProps) => {
  const subtotal = (category?.price ?? 0) * quantity;
  const discount = computeDiscount(subtotal, promo);
  const total = Math.max(0, subtotal - discount + (subtotal > 0 ? serviceFee : 0));

  return (
    <aside className="lg:sticky lg:top-6 bg-[#1A1A1A] rounded-xl border border-white/10 p-6 flex flex-col gap-4 h-fit">
      <h3 className="text-lg font-semibold text-[#F4F4F5]">Ringkasan Pesanan</h3>

      <div className="flex flex-col gap-2 text-sm">
        {category ? (
          <div className="flex items-center justify-between gap-2">
            <span className="text-zinc-400">
              {category.name} &times; {quantity}
            </span>
            <span className="text-[#F4F4F5] font-medium">{formatIDR(subtotal)}</span>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">Belum ada kategori dipilih.</p>
        )}

        {discount > 0 && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-zinc-400">Diskon ({promo?.code})</span>
            <span className="text-[#22C55E] font-medium">- {formatIDR(discount)}</span>
          </div>
        )}

        {subtotal > 0 && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-zinc-400">Biaya layanan</span>
            <span className="text-[#F4F4F5] font-medium">{formatIDR(serviceFee)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 pt-4 flex items-center justify-between gap-2">
        <span className="text-sm text-zinc-400">Total</span>
        <span className="text-xl font-bold text-[#F4F4F5]">{formatIDR(total)}</span>
      </div>

      <Button
        variant="primary"
        type="button"
        disabled={disabled}
        onClick={onSubmit}
        className="w-full"
      >
        Bayar Sekarang
      </Button>
    </aside>
  );
};

function computeDiscount(subtotal: number, promo: Promotion | null): number {
  if (!promo || subtotal === 0) return 0;
  if (promo.type === "PERCENTAGE") return Math.floor((subtotal * promo.value) / 100);
  return Math.min(subtotal, promo.value);
}
