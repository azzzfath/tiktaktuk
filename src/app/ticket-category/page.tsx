'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
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
}

const DUMMY_EVENTS = [
  { event_id: '77777777-0000-0000-0000-000000000001', event_title: 'Konser Melodi Senja' },
  { event_id: '77777777-0000-0000-0000-000000000002', event_title: 'Festival Olahraga Nasional' },
  { event_id: '77777777-0000-0000-0000-000000000003', event_title: 'Malam Jazz Bandung' },
  { event_id: '77777777-0000-0000-0000-000000000004', event_title: 'Jakarta Marathon 2024' },
  { event_id: '77777777-0000-0000-0000-000000000005', event_title: 'Konser Akbar Nusantara' },
  { event_id: '77777777-0000-0000-0000-000000000006', event_title: 'Festival Seni Budaya' },
];

const DUMMY_CATEGORIES: TicketCategory[] = [
  { category_id: '99999999-0000-0000-0000-000000000001', category_name: 'VIP', quota: 100, price: 1500000, tevent_id: '77777777-0000-0000-0000-000000000001', event_name: 'Konser Melodi Senja' },
  { category_id: '99999999-0000-0000-0000-000000000002', category_name: 'Festival', quota: 1000, price: 500000, tevent_id: '77777777-0000-0000-0000-000000000001', event_name: 'Konser Melodi Senja' },
  { category_id: '99999999-0000-0000-0000-000000000003', category_name: 'Tribune', quota: 2000, price: 350000, tevent_id: '77777777-0000-0000-0000-000000000001', event_name: 'Konser Melodi Senja' },
  { category_id: '99999999-0000-0000-0000-000000000004', category_name: 'General', quota: 500, price: 100000, tevent_id: '77777777-0000-0000-0000-000000000002', event_name: 'Festival Olahraga Nasional' },
  { category_id: '99999999-0000-0000-0000-000000000005', category_name: 'Student', quota: 200, price: 50000, tevent_id: '77777777-0000-0000-0000-000000000002', event_name: 'Festival Olahraga Nasional' },
  { category_id: '99999999-0000-0000-0000-000000000006', category_name: 'VVIP', quota: 50, price: 2000000, tevent_id: '77777777-0000-0000-0000-000000000003', event_name: 'Malam Jazz Bandung' },
  { category_id: '99999999-0000-0000-0000-000000000007', category_name: 'Regular', quota: 800, price: 750000, tevent_id: '77777777-0000-0000-0000-000000000003', event_name: 'Malam Jazz Bandung' },
  { category_id: '99999999-0000-0000-0000-000000000008', category_name: 'Full Marathon', quota: 1000, price: 800000, tevent_id: '77777777-0000-0000-0000-000000000004', event_name: 'Jakarta Marathon 2024' },
  { category_id: '99999999-0000-0000-0000-000000000009', category_name: 'Half Marathon', quota: 1500, price: 600000, tevent_id: '77777777-0000-0000-0000-000000000004', event_name: 'Jakarta Marathon 2024' },
  { category_id: '99999999-0000-0000-0000-000000000010', category_name: '10K', quota: 2000, price: 400000, tevent_id: '77777777-0000-0000-0000-000000000004', event_name: 'Jakarta Marathon 2024' },
  { category_id: '99999999-0000-0000-0000-000000000011', category_name: 'Platinum', quota: 200, price: 2500000, tevent_id: '77777777-0000-0000-0000-000000000005', event_name: 'Konser Akbar Nusantara' },
  { category_id: '99999999-0000-0000-0000-000000000012', category_name: 'Gold', quota: 500, price: 1500000, tevent_id: '77777777-0000-0000-0000-000000000005', event_name: 'Konser Akbar Nusantara' },
  { category_id: '99999999-0000-0000-0000-000000000013', category_name: 'Silver', quota: 1000, price: 850000, tevent_id: '77777777-0000-0000-0000-000000000005', event_name: 'Konser Akbar Nusantara' },
  { category_id: '99999999-0000-0000-0000-000000000014', category_name: 'Daily Pass', quota: 1000, price: 150000, tevent_id: '77777777-0000-0000-0000-000000000006', event_name: 'Festival Seni Budaya' },
];

// Ganti ke 'customer' atau 'guest' untuk test tampilan read-only
const CURRENT_ROLE = 'customer';

export default function TicketCategoryPage() {
  const [categories, setCategories] = useState<TicketCategory[]>(DUMMY_CATEGORIES);
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<TicketCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TicketCategory | null>(null);

  const isAdminOrOrganizer = CURRENT_ROLE === 'admin' || CURRENT_ROLE === 'organizer';

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
  const highestPrice = Math.max(...categories.map((c) => c.price));

  function handleCreate(data: Omit<TicketCategory, 'category_id'>) {
    const newCat: TicketCategory = { category_id: crypto.randomUUID(), ...data };
    setCategories((prev) => [...prev, newCat]);
    setModalOpen(false);
  }

  function handleUpdate(data: Omit<TicketCategory, 'category_id'>) {
    if (!editTarget) return;
    setCategories((prev) =>
      prev.map((c) => (c.category_id === editTarget.category_id ? { ...c, ...data } : c))
    );
    setEditTarget(null);
    setModalOpen(false);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setCategories((prev) => prev.filter((c) => c.category_id !== deleteTarget.category_id));
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Total Kategori</p>
            <p className="text-3xl font-bold text-white">{categories.length}</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Total Kuota</p>
            <p className="text-3xl font-bold text-white">{totalQuota.toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Harga Tertinggi</p>
            <p className="text-3xl font-bold text-white">
              Rp {highestPrice.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Table */}
        <TicketCategoryTable
          categories={filtered}
          isAdminOrOrganizer={isAdminOrOrganizer}
          search={search}
          onSearchChange={setSearch}
          eventFilter={eventFilter}
          onEventFilterChange={setEventFilter}
          events={DUMMY_EVENTS}
          onEdit={(cat) => { setEditTarget(cat); setModalOpen(true); }}
          onDelete={(cat) => setDeleteTarget(cat)}
        />
      </div>

      {modalOpen && (
        <TicketCategoryModal
          initial={editTarget}
          events={DUMMY_EVENTS}
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
