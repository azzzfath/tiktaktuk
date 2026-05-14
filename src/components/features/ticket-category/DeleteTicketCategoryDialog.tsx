'use client';

import { X, Trash2 } from 'lucide-react';
import { TicketCategory } from '@/app/ticket-category/page';

interface DeleteTicketCategoryDialogProps {
  category: TicketCategory;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteTicketCategoryDialog({
  category,
  onConfirm,
  onCancel,
}: DeleteTicketCategoryDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 w-full max-w-sm mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#EF4444]/20 flex items-center justify-center">
              <Trash2 size={14} className="text-[#EF4444]" />
            </div>
            <h2 className="text-base font-semibold text-white">Hapus Kategori Tiket</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg p-1.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Info */}
        <div className="bg-[#0F0F0F] rounded-lg border border-white/10 p-3 mb-4">
          <p className="text-xs text-zinc-500 mb-0.5">Category ID</p>
          <p className="text-xs font-mono text-zinc-300">{category.category_id}</p>
          <p className="text-xs text-zinc-500 mt-2 mb-0.5">Nama Kategori</p>
          <p className="text-sm font-medium text-white">{category.category_name}</p>
        </div>

        <p className="text-sm text-zinc-400 mb-6">
          Apakah Anda yakin ingin menghapus kategori tiket ini? Tindakan ini tidak dapat dibatalkan.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-transparent border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 rounded-lg px-4 py-2 font-medium text-sm transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-[#EF4444] text-white hover:bg-red-600 rounded-lg px-4 py-2 font-medium text-sm transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
