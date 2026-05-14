'use client';

import { useState, useEffect } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TicketCategoryTable } from '@/components/features/ticket-category/TicketCategoryTable';
import { TicketCategoryModal } from '@/components/features/ticket-category/TicketCategoryModal';
import { DeleteTicketCategoryDialog } from '@/components/features/ticket-category/DeleteTicketCategoryDialog';

export interface TicketCategory {
  category_id: string;
  category_name: string;
  quota: number;
  price: number;
  tevent_id: string;
  event_name: string;
  event?: { event_id: string; event_title: string };
}

interface Event {
  event_id: string;
  event_title: string;
}

const CURRENT_ROLE = 'admin';

export default function TicketCategoryPage() {
  const [categories, setCategories] = useState<TicketCategory[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TicketCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TicketCategory | null>(null);

  const isAdminOrOrganizer = CURRENT_ROLE === 'admin' || CURRENT_ROLE === 'organizer';

  useEffect(() => {
    fetchCategories();
    fetchEvents();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    const res = await fetch('/api/ticket-categories');
    const data = await res.json();
    const mapped = data.map((c: TicketCategory) => ({
      ...c,
      event_name: c.event?.event_title ?? '',
    }));
    setCategories(mapped);
    setLoading(false);
  }

  async function fetchEvents() {
    const res = await fetch('/api/events');
    const data = await res.json();
    setEvents(data);
  }

  const filtered = [...categories]
    .filter((c) => {
      const matchSearch = c.category_name.toLowerCase().includes(search.toLowerCase());
      const matchEvent = eventFilter ? c.tevent_id === eventFilter : true;
      return matchSearch && matchEvent;
    })
    .sort((a, b) => {
      const eventCmp = a.event_name.localeCompare(b.event_name);
      return eventCmp !== 0 ? eventCmp : a.category_name.localeCompare(b.category_name);
    });

  const totalQuota = categories.reduce((sum, c) => sum + c.quota, 0);
  const highestPrice = categories.length > 0 ? Math.max(...categories.map((c) => c.price)) : 0;

  async function handleCreate(data: Omit<TicketCategory, 'category_id'>) {
    const res = await fetch('/api/ticket-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await fetchCategories();
      setModalOpen(false);
    }
  }

  async function handleUpdate(data: Omit<TicketCategory, 'category_id'>) {
    if (!editTarget) return;
    const res = await fetch(`/api/ticket-categories/${editTarget.category_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await fetchCategories();
      setEditTarget(null);
      setModalOpen(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/ticket-categories/${deleteTarget.category_id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      await fetchCategories();
      setDeleteTarget(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Kategori Tiket</h1>
              <p className="text-zinc-500 text-sm mt-1">
                Kelola kategori dan harga tiket per acara
              </p>
            </div>
          {isAdminOrOrganizer && (
            <button
              onClick={() => { setEditTarget(null); setModalOpen(true); }}
              className="flex items-center gap-2 bg-[#6366F1] text-white hover:bg-[#4F46E5] rounded-lg px-4 py-2 font-medium transition-colors"
            >
              <Plus size={16} />
              Tambah Kategori
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Total Kategori</p>
            <p className="text-3xl font-bold text-white">{loading ? '...' : categories.length}</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Total Kuota</p>
            <p className="text-3xl font-bold text-white">{loading ? '...' : totalQuota.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Harga Tertinggi</p>
            <p className="text-3xl font-bold text-white">
              {loading ? '...' : `Rp ${highestPrice.toLocaleString('id-ID')}`}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-zinc-500 py-20">Memuat data...</div>
        ) : (
          <TicketCategoryTable
            categories={filtered}
            isAdminOrOrganizer={isAdminOrOrganizer}
            search={search}
            onSearchChange={setSearch}
            eventFilter={eventFilter}
            onEventFilterChange={setEventFilter}
            events={events}
            onEdit={(cat) => { setEditTarget(cat); setModalOpen(true); }}
            onDelete={(cat) => setDeleteTarget(cat)}
          />
        )}
      </div>

      {modalOpen && (
        <TicketCategoryModal
          initial={editTarget}
          events={events}
          onSubmit={editTarget ? handleUpdate : handleCreate}
          onClose={() => { setModalOpen(false); setEditTarget(null); }}
        />
      )}

      {deleteTarget && (
        <DeleteTicketCategoryDialog
          category={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}