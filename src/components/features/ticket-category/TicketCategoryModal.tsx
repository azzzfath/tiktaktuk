'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { TicketCategory } from '@/app/ticket-category/page';

interface Event {
  event_id: string;
  event_title: string;
}

interface TicketCategoryModalProps {
  initial: TicketCategory | null;
  events: Event[];
  onSubmit: (data: Omit<TicketCategory, 'category_id'>) => void;
  onClose: () => void;
}

export function TicketCategoryModal({ initial, events, onSubmit, onClose }: TicketCategoryModalProps) {
  const [categoryName, setCategoryName] = useState(initial?.category_name ?? '');
  const [price, setPrice] = useState(initial?.price?.toString() ?? '');
  const [quota, setQuota] = useState(initial?.quota?.toString() ?? '');
  const [eventId, setEventId] = useState(initial?.event_id ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEdit = !!initial;

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!categoryName.trim()) newErrors.categoryName = 'Nama kategori wajib diisi.';
    if (!eventId) newErrors.eventId = 'Acara wajib dipilih.';
    if (!price) newErrors.price = 'Harga wajib diisi.';
    else if (Number(price) < 0) newErrors.price = 'Harga tidak boleh negatif.';
    if (!quota) newErrors.quota = 'Kuota wajib diisi.';
    else if (!Number.isInteger(Number(quota)) || Number(quota) <= 0)
      newErrors.quota = 'Kuota harus berupa bilangan bulat positif.';
    return newErrors;
  }

  function handleSubmit() {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const selectedEvent = events.find((e) => e.event_id === eventId);
    onSubmit({
      category_name: categoryName.trim(),
      price: Number(price),
      quota: Number(quota),
      event_id: eventId,
      event_name: selectedEvent?.event_title ?? '',
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">
            {isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg p-1.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Event */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
              Acara <span className="text-[#EF4444]">*</span>
            </label>
            <select
              value={eventId}
              onChange={(e) => { setEventId(e.target.value); setErrors((p) => ({ ...p, eventId: '' })); }}
              className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50"
            >
              <option value="">Pilih acara...</option>
              {events.map((e) => (
                <option key={e.event_id} value={e.event_id}>{e.event_title}</option>
              ))}
            </select>
            {errors.eventId && <p className="text-[#EF4444] text-xs mt-1">{errors.eventId}</p>}
          </div>

          {/* Category Name */}
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
              Nama Kategori <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              placeholder="cth. WVIP"
              value={categoryName}
              onChange={(e) => { setCategoryName(e.target.value); setErrors((p) => ({ ...p, categoryName: '' })); }}
              className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50"
            />
            {errors.categoryName && <p className="text-[#EF4444] text-xs mt-1">{errors.categoryName}</p>}
          </div>

          {/* Price & Quota */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                Harga (Rp) <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="number"
                placeholder="750000"
                value={price}
                onChange={(e) => { setPrice(e.target.value); setErrors((p) => ({ ...p, price: '' })); }}
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50"
              />
              {errors.price && <p className="text-[#EF4444] text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
                Kuota <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="number"
                placeholder="100"
                value={quota}
                onChange={(e) => { setQuota(e.target.value); setErrors((p) => ({ ...p, quota: '' })); }}
                className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50"
              />
              {errors.quota && <p className="text-[#EF4444] text-xs mt-1">{errors.quota}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-transparent border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 rounded-lg px-4 py-2 font-medium text-sm transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#6366F1] text-white hover:bg-[#4F46E5] rounded-lg px-4 py-2 font-medium text-sm transition-colors"
          >
            {isEdit ? 'Simpan' : 'Tambah'}
          </button>
        </div>
      </div>
    </div>
  );
}
