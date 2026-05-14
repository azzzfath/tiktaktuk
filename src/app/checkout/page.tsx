"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createOrder, getEvent, listEvents, validatePromotionCode } from "@/lib/api";
import { useRole } from "@/hooks/useRole";
import { useToast } from "@/hooks/useToast";
import type { Event, Promotion, TicketCategory } from "@/types";
import { EventInfoCard } from "@/components/features/order/EventInfoCard";
import { CategorySelector } from "@/components/features/order/CategorySelector";
import { QuantityCounter } from "@/components/features/order/QuantityCounter";
import { SeatPicker } from "@/components/features/order/SeatPicker";
import { PromoCodeInput } from "@/components/features/order/PromoCodeInput";
import { OrderSummary } from "@/components/features/order/OrderSummary";
import { RoleSwitcher } from "@/components/features/order/RoleSwitcher";

const SERVICE_FEE = 25000;
const MAX_QUANTITY = 10;

export default function CheckoutPage() {
  const { toast } = useToast();
  const { user } = useRole();
  const [event, setEvent] = useState<Event | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [seatIds, setSeatIds] = useState<string[]>([]);
  const [promo, setPromo] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);

  const category: TicketCategory | null =
    categoryId ? event?.categories.find((cat) => cat.id === categoryId) ?? null : null;

  useEffect(() => {
    let active = true;

    async function loadEvent() {
      try {
        const events = await listEvents();
        if (active) setEvent(events[0] ?? null);
      } catch (error) {
        if (active) {
          toast(error instanceof Error ? error.message : "Gagal memuat event", "error");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadEvent();
    return () => {
      active = false;
    };
  }, [toast]);

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

  const handleSubmit = async () => {
    if (!user) {
      toast("Login sebagai customer terlebih dahulu untuk membuat order.", "error");
      return;
    }
    if (!category) {
      toast("Pilih kategori tiket terlebih dahulu.", "error");
      return;
    }

    try {
      const order = await createOrder({
        eventId: event?.id ?? "",
        categoryId: category.id,
        quantity,
        seatIds,
        promoCode: promo?.code,
      });
      const updatedEvent = await getEvent(event?.id ?? "");
      setEvent(updatedEvent);
      toast(`Order ${order.id} untuk ${quantity} tiket ${category.name} berhasil dibuat.`, "success");
      reset();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Gagal membuat order", "error");
    }
  };

  const submitDisabled = !category || quantity <= 0 || !user;

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
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
            <RoleSwitcher />
          </div>

          {loading || !event ? (
            <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-12 text-center">
              <p className="text-zinc-400">Memuat data event...</p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-6">
              <EventInfoCard event={event} />

              <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6 flex flex-col gap-6">
                <CategorySelector
                  categories={event.categories}
                  selectedId={categoryId}
                  onSelect={handleSelectCategory}
                />
                <QuantityCounter value={quantity} max={MAX_QUANTITY} onChange={handleQuantityChange} />
                <SeatPicker
                  seats={event.seats}
                  selectedIds={seatIds}
                  maxSelectable={quantity}
                  filterCategoryId={categoryId}
                  onToggle={toggleSeat}
                />
                <PromoCodeInput
                  applied={promo}
                  onApply={setPromo}
                  onValidate={validatePromotionCode}
                />
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
          )}
        </div>
      </div>
    </main>
  );
}
