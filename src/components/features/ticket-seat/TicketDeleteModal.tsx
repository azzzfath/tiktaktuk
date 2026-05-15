"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TicketRecord } from "@/types/ticket-seat";

interface TicketDeleteModalProps {
  ticket: TicketRecord | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function TicketDeleteModal({ ticket, onClose, onConfirm }: TicketDeleteModalProps) {
  return (
    <Modal isOpen={Boolean(ticket)} onClose={onClose} title="Hapus Tiket" titleClassName="text-[#EF4444]">
      <div className="flex flex-col gap-5">
        <p className="text-sm text-zinc-400">
          Apakah Anda yakin ingin menghapus tiket {ticket?.ticket_code}? Relasi kursi akan dilepaskan.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="danger" onClick={onConfirm}>Hapus</Button>
        </div>
      </div>
    </Modal>
  );
}
