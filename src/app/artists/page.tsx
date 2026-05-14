'use client';

import { useState, useEffect } from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ArtistTable } from '@/components/features/artists/ArtistTable';
import { ArtistModal } from '@/components/features/artists/ArtistModal';
import { DeleteArtistDialog } from '@/components/features/artists/DeleteArtistDialog';

export interface Artist {
  artist_id: string;
  name: string;
  genre: string;
}

const CURRENT_ROLE = 'admin';

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Artist | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Artist | null>(null);

  const isAdmin = CURRENT_ROLE === 'admin';

  useEffect(() => {
    fetchArtists();
  }, []);

  async function fetchArtists() {
    setLoading(true);
    const res = await fetch('/api/artists');
    const data = await res.json();
    setArtists(data);
    setLoading(false);
  }

  const filtered = [...artists]
    .filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.genre.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const uniqueGenres = new Set(artists.map((a) => a.genre)).size;
  const appearedInEvents = artists.length;

  async function handleCreate(data: { name: string; genre: string }) {
    const res = await fetch('/api/artists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await fetchArtists();
      setModalOpen(false);
    }
  }

  async function handleUpdate(data: { name: string; genre: string }) {
    if (!editTarget) return;
    const res = await fetch(`/api/artists/${editTarget.artist_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      await fetchArtists();
      setEditTarget(null);
      setModalOpen(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/artists/${deleteTarget.artist_id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      await fetchArtists();
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
              <h1 className="text-3xl font-bold text-white">Daftar Artis</h1>
              <p className="text-zinc-500 text-sm mt-1">
                Kelola artis yang ada di platform TikTakTuk
              </p>
            </div>
          {isAdmin && (
            <button
              onClick={() => { setEditTarget(null); setModalOpen(true); }}
              className="flex items-center gap-2 bg-[#6366F1] text-white hover:bg-[#4F46E5] rounded-lg px-4 py-2 font-medium transition-colors"
            >
              <Plus size={16} />
              Tambah Artis
            </button>
          )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Total Artis</p>
            <p className="text-3xl font-bold text-white">{loading ? '...' : artists.length}</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Genre</p>
            <p className="text-3xl font-bold text-white">{loading ? '...' : uniqueGenres}</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Tampil di Event</p>
            <p className="text-3xl font-bold text-white">{loading ? '...' : appearedInEvents}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-zinc-500 py-20">Memuat data...</div>
        ) : (
          <ArtistTable
            artists={filtered}
            isAdmin={isAdmin}
            search={search}
            onSearchChange={setSearch}
            onEdit={(artist) => { setEditTarget(artist); setModalOpen(true); }}
            onDelete={(artist) => setDeleteTarget(artist)}
          />
        )}
      </div>

      {modalOpen && (
        <ArtistModal
          initial={editTarget}
          onSubmit={editTarget ? handleUpdate : handleCreate}
          onClose={() => { setModalOpen(false); setEditTarget(null); }}
        />
      )}

      {deleteTarget && (
        <DeleteArtistDialog
          artist={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}