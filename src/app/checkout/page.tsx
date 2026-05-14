"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { findCategory, mockEvent } from "@/lib/mock-data";
import { Promotion, TicketCategory } from "@/types";
import { EventInfoCard } from "@/components/features/order/EventInfoCard";
import { CategorySelector } from "@/components/features/order/CategorySelector";
import { QuantityCounter } from "@/components/features/order/QuantityCounter";
import { SeatPicker } from "@/components/features/order/SeatPicker";
import { PromoCodeInput } from "@/components/features/order/PromoCodeInput";
import { OrderSummary } from "@/components/features/order/OrderSummary";

const SERVICE_FEE = 25000;
const MAX_QUANTITY = 10;

export default function CheckoutPage() {
  const { toast } = useToast();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [seatIds, setSeatIds] = useState<string[]>([]);
  const [promo, setPromo] = useState<Promotion | null>(null);

  const category: TicketCategory | null = categoryId ? findCategory(categoryId) ?? null : null;

  const handleSelectCategory = (nextCategoryId: string) => {
    setCategoryId(nextCategoryId);
    setSeatIds([]);
  };

  const handleQuantityChange = (nextQuantity: number) => {
    setQuantity(nextQuantity);
    setSeatIds((prev) => prev.slice(0, nextQuantity));
  };

  const toggleSeat = (id: string) => {
    setSeatIds((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= quantity) return prev;
      return [...prev, id];
    });
  };

  const reset = () => {
    setCategoryId(null);
    setQuantity(1);
    setSeatIds([]);
    setPromo(null);
  };

  const handleSubmit = () => {
    if (!category) {
      toast("Pilih kategori tiket terlebih dahulu.", "error");
      return;
    }
    console.log("[checkout] submit", {
      eventId: mockEvent.id,
      categoryId,
      quantity,
      seatIds,
      promoCode: promo?.code,
    });
    toast(`Pembayaran untuk ${quantity} tiket ${category.name} berhasil diproses.`, "success");
    reset();
  };

  const submitDisabled = !category || quantity <= 0;

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-[#6366F1] transition-colors w-fit"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali
            </Link>
            <h1 className="text-3xl font-bold">Checkout Tiket</h1>
            <p className="text-sm text-zinc-400">
              Lengkapi pesanan Anda untuk melanjutkan ke pembayaran.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-6">
              <EventInfoCard event={mockEvent} />

              <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6 flex flex-col gap-6">
                <CategorySelector
                  categories={mockEvent.categories}
                  selectedId={categoryId}
                  onSelect={handleSelectCategory}
                />
                <QuantityCounter value={quantity} max={MAX_QUANTITY} onChange={handleQuantityChange} />
                <SeatPicker
                  seats={mockEvent.seats}
                  selectedIds={seatIds}
                  maxSelectable={quantity}
                  filterCategoryId={categoryId}
                  onToggle={toggleSeat}
                />
                <PromoCodeInput applied={promo} onApply={setPromo} />
              </div>
            </div>

            <OrderSummary
              category={category}
              quantity={quantity}
              serviceFee={SERVICE_FEE}
              promo={promo}
              disabled={submitDisabled}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
