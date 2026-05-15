"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { TicketOptions, TicketRecord } from "@/types/ticket-seat";

interface TicketFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  ticket: TicketRecord | null;
  options: TicketOptions;
  onClose: () => void;
  onSubmit: (payload: { order_id?: string; category_id?: string; seat_id?: string }) => Promise<void>;
}

export function TicketFormModal({ isOpen, mode, ticket, options, onClose, onSubmit }: TicketFormModalProps) {
  const [orderId, setOrderId] = useState("");
  const [categoryId, setCategoryId] = useState(ticket?.category_id ?? "");
  const [seatId, setSeatId] = useState(ticket?.seat_id ?? "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setOrderId("");
    setCategoryId(ticket?.category_id ?? "");
    setSeatId(ticket?.seat_id ?? "");
  }, [ticket, isOpen]);

  const selectedOrder = options.orders.find((order) => order.order_id === orderId);
  const selectedCategory = options.categories.find((category) => category.category_id === categoryId);
  const categories = selectedOrder?.event_id
    ? options.categories.filter((category) => category.event_id === selectedOrder.event_id)
    : options.categories;

  const seats = useMemo(() => {
    const baseSeats = selectedCategory
      ? options.seats.filter((seat) => seat.venue_id === selectedCategory.venue_id)
      : options.seats;

    if (ticket?.seat_id && ticket.seat_label) {
      return [{ seat_id: ticket.seat_id, venue_id: selectedCategory?.venue_id ?? "", label: ticket.seat_label }, ...baseSeats];
    }

    return baseSeats;
  }, [options.seats, selectedCategory, ticket]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit(mode === "create" ? { order_id: orderId, category_id: categoryId, seat_id: seatId } : { seat_id: seatId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === "create" ? "Tambah Tiket Baru" : "Update Tiket"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === "edit" && (
          <div className="rounded-lg bg-[#0F0F0F] px-3 py-2">
            <span className="text-xs font-medium uppercase text-zinc-500">Kode Tiket</span>
            <p className="font-semibold text-white">{ticket?.ticket_code}</p>
          </div>
        )}
        {mode === "create" && (
          <>
            <Select value={orderId} onChange={(event) => setOrderId(event.target.value)} required>
              <option value="" className="bg-[#1A1A1A]">Pilih order</option>
              {options.orders.map((order) => (
                <option key={order.order_id} value={order.order_id} className="bg-[#1A1A1A]">
                  {order.order_id.slice(0, 8)} - {order.customer_name}{order.event_title ? ` - ${order.event_title}` : ""}
                </option>
              ))}
            </Select>
            <Select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} required>
              <option value="" className="bg-[#1A1A1A]">Pilih kategori tiket</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id} className="bg-[#1A1A1A]">
                  {category.category_name} - Rp {category.price.toLocaleString("id-ID")} ({category.sold_count}/{category.quota})
                </option>
              ))}
            </Select>
          </>
        )}
        <Select value={seatId} onChange={(event) => setSeatId(event.target.value)}>
          <option value="" className="bg-[#1A1A1A]">Tanpa kursi</option>
          {seats.map((seat) => (
            <option key={seat.seat_id} value={seat.seat_id} className="bg-[#1A1A1A]">
              {seat.label}
            </option>
          ))}
        </Select>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "Menyimpan..." : "Simpan"}</Button>
        </div>
      </form>
    </Modal>
  );
}
