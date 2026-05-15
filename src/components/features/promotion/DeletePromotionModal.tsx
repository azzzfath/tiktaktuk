"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Promotion } from "@/types";

interface DeletePromotionModalProps {
  promotion: Promotion | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export const DeletePromotionModal = ({
  promotion,
  onClose,
  onConfirm,
}: DeletePromotionModalProps) => {
  if (!promotion) return null;

  return (
    <Modal
      isOpen={!!promotion}
      onClose={onClose}
      title="Hapus Promo"
      titleClassName="text-[#EF4444]"
    >
      <div className="flex flex-col gap-5">
        <p className="text-sm text-zinc-300">
          Apakah Anda yakin ingin menghapus kode promo ini? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="bg-[#0F0F0F] rounded-lg border border-white/10 px-3 py-2 font-mono text-sm text-zinc-400">
          {promotion.code}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="button" variant="danger" onClick={() => onConfirm(promotion.id)}>
            Hapus
          </Button>
        </div>
      </div>
    </Modal>
  );
};
