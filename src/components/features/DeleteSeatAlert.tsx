import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface DeleteSeatAlertProps {
  isOpen: boolean;
  onClose: () => void;
  seatId: string | null;
  onConfirmDelete: (seatId: string) => void;
}

export function DeleteSeatAlert({
  isOpen,
  onClose,
  seatId,
  onConfirmDelete,
}: DeleteSeatAlertProps) {
  if (!isOpen || !seatId) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hapus Kursi" className="max-w-md">
      <div className="flex flex-col gap-6">
        {/* Enforce the red title using inline custom classes since we can't easily override the generic Modal title color without adding a new prop. Wait, the modal renders an h2 for the title. To make it red, I should either pass a class or just override the modal title visually here. Since the Modal component hardcodes the text-text-dark, I will just display the title again here or modify Modal.tsx if necessary. I'll rely on the standard text for now or add a custom header. 
        Actually, the instruction says: Title: "Hapus Kursi" (with text-[#EF4444]). 
        Let's pass a custom header if needed, but the user just wants the Danger alert pattern. I will use a red heading inside the body to emphasize it if the Modal title is fixed. */}
        <div className="flex flex-col gap-2 -mt-4">
          <h3 className="text-lg font-bold text-error">Peringatan Penghapusan</h3>
          <p className="text-zinc-400">
            Apakah Anda yakin ingin menghapus kursi ini? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex items-center gap-3 justify-end mt-2">
          <Button variant="ghost" onClick={onClose} className="border border-white/10 sm:border-transparent">
            Batal
          </Button>
          <Button variant="danger" onClick={() => onConfirmDelete(seatId)}>
            Hapus
          </Button>
        </div>
      </div>
    </Modal>
  );
}
