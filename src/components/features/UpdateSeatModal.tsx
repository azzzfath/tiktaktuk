"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SeatData, Venue } from "./CreateSeatModal";

const MOCK_VENUES: Venue[] = [
  { id: "v1", name: "Jakarta Convention Center" },
  { id: "v2", name: "Taman Ismail Marzuki" },
];

interface UpdateSeatModalProps {
  isOpen: boolean;
  onClose: () => void;
  seat: SeatData | null;
  onSubmit: (data: SeatData) => void;
}

export function UpdateSeatModal({ isOpen, onClose, seat, onSubmit }: UpdateSeatModalProps) {
  const [venueId, setVenueId] = useState(MOCK_VENUES[0].id);
  const [section, setSection] = useState("");
  const [row, setRow] = useState("");
  const [seatNumber, setSeatNumber] = useState("");

  useEffect(() => {
    if (seat) {
      setVenueId(seat.venueId);
      setSection(seat.section);
      setRow(seat.row);
      setSeatNumber(seat.seatNumber);
    }
  }, [seat]);

  if (!isOpen || !seat) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...seat, venueId, section, row, seatNumber });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Kursi">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* VENUE DROPDOWN */}
        <div className="flex flex-col gap-2">
          <label htmlFor="edit-venue" className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
            Venue
          </label>
          <select
            id="edit-venue"
            value={venueId}
            onChange={(e) => setVenueId(e.target.value)}
            className="bg-surface-dark border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
            required
          >
            {MOCK_VENUES.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* SECTION INPUT */}
        <div className="flex flex-col gap-2">
          <label htmlFor="edit-section" className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
            Section
          </label>
          <Input
            id="edit-section"
            placeholder="cth. WVIP"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            required
          />
        </div>

        {/* BARIS & NO. KURSI (TWO-COLUMN GRID) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-row" className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
              Baris
            </label>
            <Input
              id="edit-row"
              placeholder="cth. A"
              value={row}
              onChange={(e) => setRow(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-seatNumber" className="text-xs font-semibold uppercase text-zinc-400 tracking-wider">
              No. Kursi
            </label>
            <Input
              id="edit-seatNumber"
              placeholder="cth. 1"
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value)}
              required
            />
          </div>
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
