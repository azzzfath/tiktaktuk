"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TicketData } from "./TicketCard";

interface UpdateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketData | null;
  onSave: (updatedTicket: TicketData) => void;
}

// Mock available seats for the update dropdown
const MOCK_AVAILABLE_SEATS = [
  "VIP B-1",
  "VIP B-2",
  "VIP B-3",
  "Festival A-1",
];

export function UpdateTicketModal({
  isOpen,
  onClose,
  ticket,
  onSave,
}: UpdateTicketModalProps) {
  const [status, setStatus] = useState<TicketData['status']>('VALID');
  const [seat, setSeat] = useState<string>("");

  // Pre-fill form when ticket changes
  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setSeat(ticket.seat || "");
    }
  }, [ticket]);

  if (!isOpen || !ticket) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...ticket,
      status,
      seat: seat === "tanpa-kursi" ? undefined : seat,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Tiket">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* KODE TIKET (READ-ONLY) */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
            Kode Tiket
          </label>
          <Input
            value={ticket.code}
            disabled
            className="font-mono text-sm bg-zinc-900 border-transparent text-zinc-500 cursor-not-allowed"
          />
        </div>

        {/* STATUS DROPDOWN */}
        <div className="flex flex-col gap-2">
          <label htmlFor="status" className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TicketData['status'])}
            className="bg-surface-dark border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
          >
            <option value="VALID">Valid</option>
            <option value="TERPAKAI">Terpakai</option>
            <option value="KADALUWARSA">Kadaluwarsa</option>
            <option value="BATAL">Batal</option>
          </select>
        </div>

        {/* KURSI DROPDOWN (Optional) */}
        <div className="flex flex-col gap-2">
          <label htmlFor="seat" className="text-xs font-semibold uppercase text-zinc-400 tracking-wider flex items-center gap-1">
            Kursi <span className="text-zinc-500 lowercase normal-case">(opsional)</span>
          </label>
          <select
            id="seat"
            value={seat || "tanpa-kursi"}
            onChange={(e) => setSeat(e.target.value)}
            className="bg-surface-dark border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
          >
            <option value="tanpa-kursi">Tanpa Kursi</option>
            
            {/* If the current seat is not in mock array, add it to options so it isn't lost */}
            {ticket.seat && !MOCK_AVAILABLE_SEATS.includes(ticket.seat) && (
              <option value={ticket.seat}>{ticket.seat}</option>
            )}
            
            {MOCK_AVAILABLE_SEATS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3 justify-end mt-4">
          <Button type="button" variant="ghost" onClick={onClose} className="border border-white/10 sm:border-transparent">
            Batal
          </Button>
          <Button type="submit" variant="primary">
            Simpan
          </Button>
        </div>

      </form>
    </Modal>
  );
}
