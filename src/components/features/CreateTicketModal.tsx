"use client";

import React, { useState, useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// --- MOCK DATA & INTERFACES ---
interface Event {
  id: string;
  name: string;
  hasReservedSeating: boolean;
}

interface Order {
  id: string;
  order_id: string;
  customerName: string;
  eventId: string;
}

interface TicketCategory {
  id: string;
  eventId: string;
  name: string;
  price: number;
  used: number;
  quota: number;
}

interface Seat {
  id: string;
  eventId: string;
  section: string;
  row: string;
  seatNumber: string;
  isAssigned: boolean;
}

const MOCK_EVENTS: Event[] = [
  { id: "e1", name: "Festival Seni Budaya", hasReservedSeating: false },
  { id: "e2", name: "Konser Melodi Senja", hasReservedSeating: true },
];

const MOCK_ORDERS: Order[] = [
  { id: "o1", order_id: "ord_001", customerName: "Budi Santoso", eventId: "e2" },
  { id: "o2", order_id: "ord_002", customerName: "Budi Santoso", eventId: "e1" },
];

const MOCK_CATEGORIES: TicketCategory[] = [
  { id: "c1", eventId: "e1", name: "General Admission", price: 150000, used: 1, quota: 500 },
  { id: "c2", eventId: "e2", name: "VIP", price: 750000, used: 3, quota: 150 },
  { id: "c3", eventId: "e2", name: "Festival", price: 300000, used: 500, quota: 500 }, // Full quota for testing
];

const MOCK_SEATS: Seat[] = [
  { id: "s1", eventId: "e2", section: "Category 1", row: "C", seatNumber: "1", isAssigned: false },
  { id: "s2", eventId: "e2", section: "Category 1", row: "C", seatNumber: "2", isAssigned: true },
  { id: "s3", eventId: "e2", section: "Category 1", row: "C", seatNumber: "3", isAssigned: false },
];

// --- COMPONENT ---
interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTicketModal({ isOpen, onClose }: CreateTicketModalProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSeatId, setSelectedSeatId] = useState<string>("");

  // Derived state based on selections
  const selectedOrder = useMemo(() => 
    MOCK_ORDERS.find((o) => o.id === selectedOrderId), 
  [selectedOrderId]);

  const selectedEvent = useMemo(() => 
    MOCK_EVENTS.find((e) => e.id === selectedOrder?.eventId), 
  [selectedOrder]);

  const availableCategories = useMemo(() => 
    MOCK_CATEGORIES.filter((c) => c.eventId === selectedEvent?.id),
  [selectedEvent]);

  const availableSeats = useMemo(() => 
    MOCK_SEATS.filter((s) => s.eventId === selectedEvent?.id && !s.isAssigned),
  [selectedEvent]);

  // Handlers
  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOrderId(e.target.value);
    setSelectedCategoryId(""); // Reset dependent fields
    setSelectedSeatId("");
  };

  const handleClose = () => {
    // Reset state on close
    setSelectedOrderId("");
    setSelectedCategoryId("");
    setSelectedSeatId("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit Ticket", { selectedOrderId, selectedCategoryId, selectedSeatId });
    // Add logic to actually submit
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Tambah Tiket Baru">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* ORDER SELECT */}
        <div className="flex flex-col gap-2">
          <label htmlFor="order" className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
            Order
          </label>
          <select
            id="order"
            value={selectedOrderId}
            onChange={handleOrderChange}
            className="bg-surface-dark border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none disabled:opacity-50"
            required
          >
            <option value="" disabled>Pilih Order...</option>
            {MOCK_ORDERS.map((order) => {
              const event = MOCK_EVENTS.find((e) => e.id === order.eventId);
              return (
                <option key={order.id} value={order.id}>
                  {order.order_id} — {order.customerName} — {event?.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* KATEGORI TIKET SELECT */}
        <div className="flex flex-col gap-2">
          <label htmlFor="category" className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
            Kategori Tiket
          </label>
          <select
            id="category"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            disabled={!selectedEvent}
            className="bg-surface-dark border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
            required
          >
            <option value="" disabled>Pilih Kategori...</option>
            {availableCategories.map((category) => {
              const isFull = category.used >= category.quota;
              const formattedPrice = category.price.toLocaleString('id-ID');
              return (
                <option key={category.id} value={category.id} disabled={isFull}>
                  {category.name} — Rp {formattedPrice} ({category.used}/{category.quota}) {isFull ? "(Penuh)" : ""}
                </option>
              );
            })}
          </select>
        </div>

        {/* KURSI SELECT (CONDITIONAL) */}
        {selectedEvent?.hasReservedSeating && (
          <div className="flex flex-col gap-2">
            <label htmlFor="seat" className="text-xs font-semibold uppercase text-zinc-400 tracking-wider flex items-center gap-1">
              Kursi <span className="text-zinc-500 lowercase normal-case">(opsional — reserved seating)</span>
            </label>
            <select
              id="seat"
              value={selectedSeatId}
              onChange={(e) => setSelectedSeatId(e.target.value)}
              className="bg-surface-dark border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
            >
              <option value="">Pilih Kursi...</option>
              {availableSeats.map((seat) => (
                <option key={seat.id} value={seat.id}>
                  {seat.section} — Baris {seat.row}, No. {seat.seatNumber}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* KODE TIKET INPUT (READ-ONLY) */}
        <div className="flex flex-col gap-2">
          <label htmlFor="ticketCode" className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
            Kode Tiket
          </label>
          <Input
            id="ticketCode"
            type="text"
            placeholder="Auto-generate saat dibuat"
            disabled
            className="font-mono text-sm bg-zinc-900 border-transparent text-zinc-500 placeholder:text-zinc-500 cursor-not-allowed"
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3 justify-end mt-4">
          <Button type="button" variant="ghost" onClick={handleClose} className="px-6 border border-white/10 sm:border-transparent">
            Batal
          </Button>
          <Button type="submit" variant="primary" className="px-8" disabled={!selectedOrderId || !selectedCategoryId}>
            Buat Tiket
          </Button>
        </div>

      </form>
    </Modal>
  );
}
