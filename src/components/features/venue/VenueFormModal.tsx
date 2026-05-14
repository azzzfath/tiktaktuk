"use client";

import { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type { VenueFormValues } from "@/lib/api";
import type { Venue } from "@/types";

interface VenueFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Venue | null; 
  onSubmit: (values: VenueFormValues) => void;
}

export const VenueFormModal = ({ isOpen, onClose, initialData, onSubmit }: VenueFormModalProps) => {
  const isEditing = !!initialData;
  const title = isEditing ? "Edit Venue" : "Tambah Venue Baru";
  const submitText = isEditing ? "Simpan" : "Tambah";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onSubmit({
      venue_name: String(form.get("venue_name") ?? ""),
      capacity: Number(form.get("capacity") ?? 0),
      city: String(form.get("city") ?? ""),
      address: String(form.get("address") ?? ""),
      hasReservedSeating: form.get("hasReservedSeating") === "on",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* NAMA VENUE */}
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1.5 tracking-wider uppercase">
            NAMA VENUE (VENUE_NAME)
          </label>
          <Input 
            name="venue_name"
            placeholder="cth. Jakarta Convention Center" 
            defaultValue={initialData?.venue_name || ""}
          />
        </div>

        {/* GRID: KAPASITAS & KOTA */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 tracking-wider uppercase">
              KAPASITAS (CAPACITY)
            </label>
            <Input 
              name="capacity"
              type="number" 
              placeholder="1000" 
              defaultValue={initialData?.capacity || ""}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1.5 tracking-wider uppercase">
              KOTA (CITY)
            </label>
            <Input 
              name="city"
              placeholder="Jakarta" 
              defaultValue={initialData?.city || ""}
            />
          </div>
        </div>

        {/* ALAMAT */}
        <div>
          <label className="block text-xs font-semibold text-zinc-500 mb-1.5 tracking-wider uppercase">
            ALAMAT (ADDRESS)
          </label>
          <textarea 
            name="address"
            className="bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-[#F4F4F5] placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 w-full min-h-[100px] resize-y"
            placeholder="Jl. Gatot Subroto No.1"
            defaultValue={initialData?.address || ""}
          />
        </div>

        {/* CHECKBOX RESERVED SEATING */}
        <div className="flex items-center gap-2 pt-2">
          <input 
            name="hasReservedSeating"
            type="checkbox" 
            id="reserved-seating"
            className="w-4 h-4 rounded border-white/10 bg-[#1A1A1A] text-[#6366F1] focus:ring-[#6366F1]/50 focus:ring-offset-[#0F0F0F]"
            defaultChecked={initialData?.hasReservedSeating || false}
          />
          <label htmlFor="reserved-seating" className="text-sm text-[#F4F4F5]">
            Has Reserved Seating
          </label>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 pt-6 border-t border-white/10 mt-6">
          <Button type="button" variant="ghost" className="w-full bg-[#1A1A1A] border border-white/10" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" className="w-full">
            {submitText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
