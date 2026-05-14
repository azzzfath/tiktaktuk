'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Artist } from '@/app/artists/page';

interface ArtistModalProps {
  initial: Artist | null;
  onSubmit: (data: { name: string; genre: string }) => void;
  onClose: () => void;
}

export function ArtistModal({ initial, onSubmit, onClose }: ArtistModalProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [genre, setGenre] = useState(initial?.genre ?? '');
  const [error, setError] = useState('');

  const isEdit = !!initial;

  function handleSubmit() {
    if (!name.trim()) {
      setError('Nama artis wajib diisi.');
      return;
    }
    setError('');
    onSubmit({ name: name.trim(), genre: genre.trim() });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] rounded-2xl border border-white/10 w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">
            {isEdit ? 'Edit Artis' : 'Tambah Artis Baru'}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg p-1.5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
              Nama Artis <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              placeholder="cth. Fourtwnty"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 text-sm"
            />
            {error && <p className="text-[#EF4444] text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">
              Genre
            </label>
            <input
              type="text"
              placeholder="cth. Indie Folk"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 text-sm"
            />
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
            {isEdit ? 'Simpan Perubahan' : 'Tambah Artis'}
          </button>
        </div>
      </div>
    </div>
  );
}
