"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { SeatRecord } from "@/types/ticket-seat";

interface SeatDeleteModalProps {
  seat: SeatRecord | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function SeatDeleteModal({ seat, onClose, onConfirm }: SeatDeleteModalProps) {
  return (
    <Modal isOpen={Boolean(seat)} onClose={onClose} title="Hapus Kursi" titleClassName="text-[#EF4444]">
      <div className="flex flex-col gap-5">
        <p className="text-sm text-zinc-400">
          Apakah Anda yakin ingin menghapus kursi {seat?.section} - Baris {seat?.row_number}, No. {seat?.seat_number}?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="danger" onClick={onConfirm}>Hapus</Button>
        </div>
      </div>
    </Modal>
  );
}
