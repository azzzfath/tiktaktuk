"use client";

import { Modal } from "@/components/ui/Modal";
import { PromotionForm, PromotionFormValues } from "./PromotionForm";

interface CreatePromotionModalProps {
  open: boolean;
  existingCodes: string[];
  onClose: () => void;
  onSubmit: (values: PromotionFormValues) => void;
}

export const CreatePromotionModal = ({
  open,
  existingCodes,
  onClose,
  onSubmit,
}: CreatePromotionModalProps) => {
  return (
    <Modal isOpen={open} onClose={onClose} title="Buat Promo Baru">
      <PromotionForm
        existingCodes={existingCodes}
        submitLabel="Buat"
        onCancel={onClose}
        onSubmit={onSubmit}
      />
    </Modal>
  );
};
