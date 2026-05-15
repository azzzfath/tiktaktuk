"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import type { Venue } from "@/types";

interface VenueFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Venue | null;
}

export function VenueFormModal({ isOpen, onClose, onSuccess, initialData }: VenueFormModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    venue_name: "",
    capacity: 0,
    address: "",
    city: "",
    hasReservedSeating: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        venue_name: initialData.venue_name,
        capacity: initialData.capacity,
        address: initialData.address || "",
        city: initialData.city,
        hasReservedSeating: initialData.hasReservedSeating,
      });
    } else {
      setFormData({ venue_name: "", capacity: 0, address: "", city: "", hasReservedSeating: false });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = initialData ? "PUT" : "POST";
    const url = initialData ? `/api/venues/${initialData.venue_id}` : "/api/venues";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data.");

      toast(initialData ? "Venue berhasil diupdate!" : "Venue baru berhasil ditambahkan!", "success");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Venue" : "Tambah Venue"}>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Nama Venue</label>
          <Input 
            required 
            value={formData.venue_name} 
            onChange={e => setFormData({...formData, venue_name: e.target.value})} 
            placeholder="Contoh: Balai Sidang UI" 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Kapasitas</label>
            <Input 
              type="number" 
              required 
              value={formData.capacity} 
              onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Kota</label>
            <Input 
              required 
              value={formData.city} 
              onChange={e => setFormData({...formData, city: e.target.value})} 
              placeholder="Contoh: Depok" 
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-zinc-500 uppercase mb-1 block">Alamat</label>
          <Input 
            value={formData.address} 
            onChange={e => setFormData({...formData, address: e.target.value})} 
            placeholder="Jl. Margonda Raya..." 
          />
        </div>
        <div className="flex items-center gap-2 py-2">
          <input 
            type="checkbox" 
            id="reserved"
            checked={formData.hasReservedSeating}
            onChange={e => setFormData({...formData, hasReservedSeating: e.target.checked})}
            className="w-4 h-4 rounded border-white/10 bg-[#1A1A1A] text-[#6366F1]"
          />
          <label htmlFor="reserved" className="text-sm text-zinc-300">Gunakan Reserved Seating (Kursi Bernomor)</label>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Batal</Button>
          <Button type="submit" disabled={loading} className="flex-1 bg-[#6366F1]">{loading ? "Menyimpan..." : "Simpan"}</Button>
        </div>
      </form>
    </Modal>
  );
}