"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { SeatRecord, VenueOption } from "@/types/ticket-seat";

interface SeatFormModalProps {
  isOpen: boolean;
  seat: SeatRecord | null;
  venues: VenueOption[];
  onClose: () => void;
  onSubmit: (payload: { venue_id: string; section: string; row_number: string; seat_number: string }) => Promise<void>;
}

export function SeatFormModal({ isOpen, seat, venues, onClose, onSubmit }: SeatFormModalProps) {
  const [venueId, setVenueId] = useState("");
  const [section, setSection] = useState("");
  const [rowNumber, setRowNumber] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setVenueId(seat?.venue_id ?? "");
    setSection(seat?.section ?? "");
    setRowNumber(seat?.row_number ?? "");
    setSeatNumber(seat?.seat_number ?? "");
  }, [seat, isOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit({ venue_id: venueId, section, row_number: rowNumber, seat_number: seatNumber });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={seat ? "Edit Kursi" : "Tambah Kursi Baru"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Select value={venueId} onChange={(event) => setVenueId(event.target.value)} required>
          <option value="" className="bg-[#1A1A1A]">Pilih venue</option>
          {venues.map((venue) => (
            <option key={venue.venue_id} value={venue.venue_id} className="bg-[#1A1A1A]">
              {venue.venue_name}
            </option>
          ))}
        </Select>
        <Input placeholder="Section, contoh: VIP" value={section} onChange={(event) => setSection(event.target.value)} required />
        <Input placeholder="Baris, contoh: A" value={rowNumber} onChange={(event) => setRowNumber(event.target.value)} required />
        <Input placeholder="No. kursi, contoh: 12" value={seatNumber} onChange={(event) => setSeatNumber(event.target.value)} required />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" disabled={submitting}>{submitting ? "Menyimpan..." : "Simpan"}</Button>
        </div>
      </form>
    </Modal>
  );
}
