"use client";

import { FormEvent, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Order, PaymentStatus } from "@/types";

interface UpdateOrderModalProps {
  order: Order | null;
  onClose: () => void;
  onSubmit: (id: string, status: PaymentStatus) => void;
}

const options: { value: PaymentStatus; label: string }[] = [
  { value: "PAID", label: "Lunas" },
  { value: "PENDING", label: "Pending" },
  { value: "CANCELLED", label: "Dibatalkan" },
];

export const UpdateOrderModal = ({ order, onClose, onSubmit }: UpdateOrderModalProps) => {
  if (!order) return null;

  return (
    <UpdateOrderModalContent
      key={`${order.id}-${order.status}`}
      order={order}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
};

const UpdateOrderModalContent = ({ order, onClose, onSubmit }: Omit<UpdateOrderModalProps, "order"> & { order: Order }) => {
  const [status, setStatus] = useState<PaymentStatus>(order.status);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(order.id, status);
  };

  return (
    <Modal isOpen={!!order} onClose={onClose} title="Update Status Order">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-300">Order ID</label>
          <input
            value={order.id}
            readOnly
            className="bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-zinc-400 font-mono text-sm cursor-not-allowed"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-300">Payment Status</label>
          <Select value={status} onChange={(e) => setStatus(e.target.value as PaymentStatus)}>
            {options.map((o) => (
              <option key={o.value} value={o.value} className="bg-[#1A1A1A]">
                {o.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary">
            Update
          </Button>
        </div>
      </form>
    </Modal>
  );
};
