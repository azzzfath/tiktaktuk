"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import type { Event, Promotion, TicketCategory } from "@/types";
import { EventInfoCard } from "@/components/features/order/EventInfoCard";
import { CategorySelector } from "@/components/features/order/CategorySelector";
import { QuantityCounter } from "@/components/features/order/QuantityCounter";
import { SeatPicker } from "@/components/features/order/SeatPicker";
import { PromoCodeInput } from "@/components/features/order/PromoCodeInput";
import { OrderSummary } from "@/components/features/order/OrderSummary";

const SERVICE_FEE = 25000;
const MAX_QUANTITY = 10;

export function CheckoutFlow() {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [eventId, setEventId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [seatIds, setSeatIds] = useState<string[]>([]);
  const [promo, setPromo] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const event = events.find((item) => item.event_id === eventId) ?? events[0] ?? null;
  const category: TicketCategory | null =
    categoryId ? event?.categories.find((cat) => cat.id === categoryId) ?? null : null;

  useEffect(() => {
    let active = true;

    async function loadEvents() {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) throw new Error(await readError(response));
        const data = (await response.json()) as Event[];
        if (!active) return;
        setEvents(data);
        setEventId(data[0]?.event_id ?? "");
      } catch (error) {
        if (active) toast(error instanceof Error ? error.message : "Gagal memuat event.", "error");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadEvents();
    return () => {
      active = false;
    };
  }, [toast]);

  const handleSelectEvent = (nextEventId: string) => {
    setEventId(nextEventId);
    setCategoryId(null);
    setSeatIds([]);
    setPromo(null);
  };

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
      if (prev.includes(id)) return prev.filter((seatId) => seatId !== id);
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
    if (!category) {
      toast("Pilih kategori tiket terlebih dahulu.", "error");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event?.event_id,
          categoryId: category.id,
          quantity,
          seatIds,
          promoCode: promo?.code,
        }),
      });
      if (!response.ok) throw new Error(await readError(response));
      const order = await response.json() as { id: string };
      toast(`Order ${order.id} untuk ${quantity} tiket ${category.name} berhasil dibuat.`, "success");
      reset();
    } catch (error) {
      toast(error instanceof Error ? error.message : "Gagal membuat order.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const validatePromotionCode = async (code: string) => {
    const response = await fetch(`/api/promotions/validate/${encodeURIComponent(code)}`);
    if (!response.ok) throw new Error(await readError(response));
    return response.json() as Promise<Promotion>;
  };

  const submitDisabled = !category || quantity <= 0 || submitting;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Checkout Tiket</h1>
          <p className="text-sm text-zinc-400">
            Lengkapi pesanan Anda untuk melanjutkan ke pembayaran.
          </p>
        </div>

        {loading || !event ? (
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-12 text-center">
            <p className="text-zinc-400">Memuat data event...</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="flex flex-col gap-6">
              {events.length > 1 && (
                <label className="flex flex-col gap-2 text-sm font-medium text-zinc-300">
                  Event
                  <select
                    value={event.event_id}
                    onChange={(changeEvent) => handleSelectEvent(changeEvent.target.value)}
                    className="bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-[#F4F4F5] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50"
                  >
                    {events.map((item) => (
                      <option key={item.event_id} value={item.event_id} className="bg-[#1A1A1A]">
                        {item.event_title}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <EventInfoCard event={event} />

              <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6 flex flex-col gap-6">
                <CategorySelector
                  categories={event.categories}
                  selectedId={categoryId}
                  onSelect={handleSelectCategory}
                />
                <QuantityCounter value={quantity} max={MAX_QUANTITY} onChange={handleQuantityChange} />
                <SeatPicker
                  seats={event.seats ?? []}
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
    </section>
  );
}

async function readError(response: Response) {
  const payload = await response.json().catch(() => null) as { error?: string; message?: string } | null;
  return payload?.error ?? payload?.message ?? "Request gagal.";
}
