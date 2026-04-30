"use client";

import { Modal } from "@/components/ui/Modal";
import { Promotion } from "@/types";
import { PromotionForm, PromotionFormValues } from "./PromotionForm";

interface EditPromotionModalProps {
  promotion: Promotion | null;
  existingCodes: string[];
  onClose: () => void;
  onSubmit: (id: string, values: PromotionFormValues) => void;
}

export const EditPromotionModal = ({
  promotion,
  existingCodes,
  onClose,
  onSubmit,
}: EditPromotionModalProps) => {
  if (!promotion) return null;

  return (
    <Modal isOpen={!!promotion} onClose={onClose} title="Edit Promo">
      <PromotionForm
        initialValues={{
          code: promotion.code,
          type: promotion.type,
          value: promotion.value,
          startDate: promotion.startDate,
          endDate: promotion.endDate,
          usageLimit: promotion.usageLimit,
        }}
        existingCodes={existingCodes}
        submitLabel="Simpan"
        onCancel={onClose}
        onSubmit={(values) => onSubmit(promotion.id, values)}
      />
    </Modal>
  );
};
