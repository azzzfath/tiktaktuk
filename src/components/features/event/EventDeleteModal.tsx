"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface EventDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const EventDeleteModal = ({ isOpen, onClose, onConfirm }: EventDeleteModalProps) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Hapus Acara" 
      titleClassName="text-[#EF4444]"
    >
      <div className="space-y-6">
        <p className="text-[#F4F4F5]">
          Apakah Anda yakin ingin menghapus acara ini? Semua data terkait kategori tiket dan jadwal akan ikut terhapus secara permanen. Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" className="bg-[#1A1A1A] border border-white/10 text-white" onClick={onClose}>
            Batal
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm} className="bg-[#EF4444] text-white">
            Hapus
          </Button>
        </div>
      </div>
    </Modal>
  );
};