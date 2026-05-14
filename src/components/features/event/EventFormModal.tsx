"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import type { Event, TicketCategory } from "@/types";

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Event | null;
}

export const EventFormModal = ({ isOpen, onClose, initialData }: EventFormModalProps) => {
  const isEditing = !!initialData;
  const [categories, setCategories] = useState<TicketCategory[]>([
    { name: "", price: 0, quota: 0 }
  ]);

  useEffect(() => {
    if (initialData?.categories) {
      setCategories(initialData.categories);
    } else {
      setCategories([{ name: "", price: 0, quota: 0 }]);
    }
  }, [initialData, isOpen]);

  const addCategory = () => setCategories([...categories, { name: "", price: 0, quota: 0 }]);
  const removeCategory = (index: number) => setCategories(categories.filter((_, i) => i !== index));

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? "Edit Acara" : "Buat Acara Baru"}
      className="max-w-3xl" // Modal dibuat lebih lebar
    >
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* KOLOM KIRI */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Judul Acara (Event_Title)
              </label>
              <Input placeholder="cth. Konser Melodi Senja" defaultValue={initialData?.title} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                  Tanggal (Date)
                </label>
                <Input type="date" defaultValue={initialData?.date} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                  Waktu (Time)
                </label>
                <Input type="time" defaultValue={initialData?.time} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Venue (Venue_ID)
              </label>
              <select className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#6366F1]/50 outline-none">
                <option>Jakarta Convention Center</option>
                <option>ICE BSD</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Artis (Event_Artist)
              </label>
              <div className="flex flex-wrap gap-2">
                {["Fourtwnty", "Hindia", "Tulus", "Nadin Amizah"].map((artist) => (
                  <Badge 
                    key={artist} 
                    variant={initialData?.artists?.includes(artist) ? "primary" : "muted"}
                    className="cursor-pointer hover:opacity-80"
                  >
                    {artist}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Kategori Tiket (Ticket_Category)
              </label>
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                {categories.map((cat, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10 relative group">
                    <button 
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="absolute -right-2 -top-2 bg-[#EF4444] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <Input placeholder="Nama Kategori (cth: VIP)" className="mb-2 h-8 text-xs" defaultValue={cat.name} />
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="number" placeholder="Harga" className="h-8 text-xs" defaultValue={cat.price} />
                      <Input type="number" placeholder="Kuota" className="h-8 text-xs" defaultValue={cat.quota} />
                    </div>
                  </div>
                ))}
              </div>
              <button 
                type="button"
                onClick={addCategory}
                className="mt-2 text-[#6366F1] text-xs font-bold flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3 h-3" /> Tambah Kategori
              </button>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Deskripsi
              </label>
              <textarea 
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-[#6366F1]/50 outline-none min-h-[100px] resize-none text-sm"
                placeholder="Deskripsi acara..."
                defaultValue={initialData?.description}
              />
            </div>
          </div>
        </div>

        {/* TOMBOL AKSI */}
        <div className="flex gap-4 pt-6 border-t border-white/10 mt-4">
          <Button type="button" variant="ghost" className="w-full bg-[#1A1A1A] border border-white/10" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" className="w-full">
            {isEditing ? "Simpan" : "Buat Acara"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};