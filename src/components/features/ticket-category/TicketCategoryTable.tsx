'use client';

import { Search, Pencil, Trash2 } from 'lucide-react';
import { TicketCategory } from '@/app/ticket-category/page';

interface Event {
  event_id: string;
  event_title: string;
}

interface TicketCategoryTableProps {
  categories: TicketCategory[];
  isAdminOrOrganizer: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  eventFilter: string;
  onEventFilterChange: (val: string) => void;
  events: Event[];
  onEdit: (cat: TicketCategory) => void;
  onDelete: (cat: TicketCategory) => void;
}

export function TicketCategoryTable({
  categories,
  isAdminOrOrganizer,
  search,
  onSearchChange,
  eventFilter,
  onEventFilterChange,
  events,
  onEdit,
  onDelete,
}: TicketCategoryTableProps) {
  return (
    <div className="bg-[#1A1A1A] rounded-xl border border-white/10">
      {/* Filters */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari kategori..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#0F0F0F] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50"
          />
        </div>
        <select
          value={eventFilter}
          onChange={(e) => onEventFilterChange(e.target.value)}
          className="bg-[#0F0F0F] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]/50"
        >
          <option value="">Semua Acara</option>
          {events.map((e) => (
            <option key={e.event_id} value={e.event_id}>
              {e.event_title}
            </option>
          ))}
        </select>
      </div>

      {/* Result count */}
      <div className="px-4 py-2 border-b border-white/10">
        <p className="text-xs text-zinc-500">{categories.length} kategori ditemukan</p>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Category ID
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Kategori
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Acara
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Harga
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Kuota
            </th>
            {isAdminOrOrganizer && (
              <th className="text-right px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Aksi
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr
              key={cat.category_id}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="px-4 py-3 text-xs text-zinc-500 font-mono">
                {cat.category_id.slice(0, 8)}...
              </td>
              <td className="px-4 py-3 text-sm font-medium text-white">{cat.category_name}</td>
              <td className="px-4 py-3 text-sm text-zinc-300">{cat.event_name}</td>
              <td className="px-4 py-3">
                <span className="text-sm font-medium text-[#22C55E]">
                  Rp {cat.price.toLocaleString('id-ID')}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-zinc-300">
                {cat.quota.toLocaleString('id-ID')} tiket
              </td>
              {isAdminOrOrganizer && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(cat)}
                      className="bg-transparent text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg p-2 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(cat)}
                      className="bg-transparent text-zinc-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg p-2 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td
                colSpan={isAdminOrOrganizer ? 6 : 5}
                className="px-4 py-10 text-center text-zinc-500 text-sm"
              >
                Tidak ada kategori ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
