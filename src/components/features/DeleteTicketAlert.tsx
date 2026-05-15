import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface DeleteTicketAlertProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string | null;
  onConfirmDelete: (ticketId: string) => void;
}

export function DeleteTicketAlert({
  isOpen,
  onClose,
  ticketId,
  onConfirmDelete,
}: DeleteTicketAlertProps) {
  if (!isOpen || !ticketId) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hapus Tiket" className="max-w-md">
      <div className="flex flex-col gap-6">
        <p className="text-zinc-400">
          Apakah Anda yakin ingin menghapus tiket ini? Relasi kursi akan dilepaskan. Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex items-center gap-3 justify-end mt-2">
          <Button variant="ghost" onClick={onClose} className="border border-white/10 sm:border-transparent">
            Batal
          </Button>
          <Button variant="danger" onClick={() => onConfirmDelete(ticketId)}>
            Hapus
          </Button>
        </div>
      </div>
    </Modal>
  );
}
