"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface VenueDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const VenueDeleteModal = ({ isOpen, onClose, onConfirm }: VenueDeleteModalProps) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Hapus Venue" 
      titleClassName="text-[#EF4444]"
    >
      <div className="space-y-6">
        <p className="text-[#F4F4F5]">
          Apakah Anda yakin ingin menghapus venue ini? Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" className="bg-[#1A1A1A] border border-white/10" onClick={onClose}>
            Batal
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm}>
            Hapus
          </Button>
        </div>
      </div>
    </Modal>
  );
};