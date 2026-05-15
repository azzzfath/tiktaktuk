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
  onSubmit: (data: Partial<Event>) => Promise<void>;
}

export const EventFormModal = ({ isOpen, onClose, initialData, onSubmit }: EventFormModalProps) => {
  const isEditing = !!initialData;
  
  const [formData, setFormData] = useState({
    event_title: "",
    event_date: "",
    event_time: "",
    venue_id: "",
    description: "",
    artists: [] as string[],
  });

  const [categories, setCategories] = useState<TicketCategory[]>([
    { name: "", price: 0, quota: 0 }
  ]);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        event_title: initialData.event_title || "",
        event_date: initialData.event_date || "",
        event_time: initialData.event_time || "",
        venue_id: initialData.venue_id || "",
        description: initialData.description || "",
        artists: initialData.artists || [],
      });
      setCategories(initialData.categories || [{ name: "", price: 0, quota: 0 }]);
    } else if (!isOpen) {
      setFormData({ event_title: "", event_date: "", event_time: "", venue_id: "", description: "", artists: [] });
      setCategories([{ name: "", price: 0, quota: 0 }]);
    }
  }, [initialData, isOpen]);

  const addCategory = () => setCategories([...categories, { name: "", price: 0, quota: 0 }]);
  const removeCategory = (index: number) => setCategories(categories.filter((_, i) => i !== index));

  const updateCat = (idx: number, field: keyof TicketCategory, val: any) => {
    const newCats = [...categories];
    newCats[idx] = { ...newCats[idx], [field]: val };
    setCategories(newCats);
  };

  const toggleArtist = (artist: string) => {
    setFormData(prev => ({
      ...prev,
      artists: prev.artists.includes(artist) 
        ? prev.artists.filter(a => a !== artist) 
        : [...prev.artists, artist]
    }));
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...formData, categories });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Acara" : "Buat Acara Baru"} className="max-w-3xl">
      <form className="space-y-6" onSubmit={handleAction}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Judul Acara</label>
              <Input 
                required value={formData.event_title}
                onChange={(e) => setFormData({...formData, event_title: e.target.value})}
                placeholder="cth. Konser Melodi Senja" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Tanggal</label>
                <Input required type="date" value={formData.event_date} onChange={(e) => setFormData({...formData, event_date: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Waktu</label>
                <Input required type="time" value={formData.event_time} onChange={(e) => setFormData({...formData, event_time: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Venue (ID)</label>
              <Input required placeholder="Masukkan ID Venue" value={formData.venue_id} onChange={(e) => setFormData({...formData, venue_id: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Artis</label>
              <div className="flex flex-wrap gap-2">
                {["Fourtwnty", "Hindia", "Tulus", "Nadin Amizah"].map((artist) => (
                  <Badge 
                    key={artist} variant={formData.artists.includes(artist) ? "primary" : "muted"}
                    className="cursor-pointer" onClick={() => toggleArtist(artist)}
                  >
                    {artist}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Kategori Tiket</label>
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                {categories.map((cat, index) => (
                  <div key={index} className="p-3 bg-white/5 rounded-lg border border-white/10 relative group">
                    <button type="button" onClick={() => removeCategory(index)} className="absolute -right-2 -top-2 bg-[#EF4444] text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                    <Input placeholder="Nama (cth: VIP)" className="mb-2 h-8 text-xs" value={cat.name} onChange={(e) => updateCat(index, 'name', e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="number" placeholder="Harga" className="h-8 text-xs" value={cat.price} onChange={(e) => updateCat(index, 'price', Number(e.target.value))} />
                      <Input type="number" placeholder="Kuota" className="h-8 text-xs" value={cat.quota} onChange={(e) => updateCat(index, 'quota', Number(e.target.value))} />
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addCategory} className="mt-2 text-[#6366F1] text-xs font-bold flex items-center gap-1 hover:underline">
                <Plus className="w-3 h-3" /> Tambah Kategori
              </button>
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 block">Deskripsi</label>
              <textarea 
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm min-h-[100px] resize-none"
                value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-6 border-t border-white/10 mt-4">
          <Button type="button" variant="ghost" className="w-full bg-[#1A1A1A] border border-white/10" onClick={onClose}>Batal</Button>
          <Button type="submit" variant="primary" className="w-full bg-[#6366F1]">
            {isEditing ? "Simpan Perubahan" : "Buat Acara"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};