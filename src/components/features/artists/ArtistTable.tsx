'use client';

import { Search, Pencil, Trash2 } from 'lucide-react';
import { Artist } from '@/app/artists/page';

interface ArtistTableProps {
  artists: Artist[];
  isAdmin: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  onEdit: (artist: Artist) => void;
  onDelete: (artist: Artist) => void;
}

export function ArtistTable({
  artists,
  isAdmin,
  search,
  onSearchChange,
  onEdit,
  onDelete,
}: ArtistTableProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-xl border border-white/10">
      {/* Table Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-base font-semibold text-white">Tabel Artis</h2>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari nama atau genre..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-[#0F0F0F] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50 w-56"
          />
        </div>
      </div>

      {/* Result count */}
      <div className="px-4 py-2 border-b border-white/10">
        <p className="text-xs text-zinc-500">{artists.length} artis ditemukan</p>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Artist ID
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Artis
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Genre
            </th>
            {isAdmin && (
              <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Aksi
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {artists.map((artist) => (
            <tr
              key={artist.artist_id}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="px-4 py-3 text-xs text-zinc-500 font-mono">
                {artist.artist_id.slice(0, 8)}...
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#6366F1] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {artist.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-white">{artist.name}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-[#6366F1]/20 text-[#6366F1]">
                  {artist.genre}
                </span>
              </td>
              {isAdmin && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(artist)}
                      className="bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg p-2 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(artist)}
                      className="bg-transparent text-zinc-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg p-2 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
          {artists.length === 0 && (
            <tr>
              <td colSpan={isAdmin ? 4 : 3} className="px-4 py-10 text-center text-zinc-500 text-sm">
                Tidak ada artis ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
