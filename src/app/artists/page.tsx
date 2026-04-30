'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ArtistTable } from '@/components/features/artists/ArtistTable';
import { ArtistModal } from '@/components/features/artists/ArtistModal';
import { DeleteArtistDialog } from '@/components/features/artists/DeleteArtistDialog';

export interface Artist {
  artist_id: string;
  name: string;
  genre: string;
}

const DUMMY_ARTISTS: Artist[] = [
  { artist_id: '88888888-0000-0000-0000-000000000001', name: 'Tulus', genre: 'Pop' },
  { artist_id: '88888888-0000-0000-0000-000000000002', name: 'Sheila On 7', genre: 'Pop Rock' },
  { artist_id: '88888888-0000-0000-0000-000000000003', name: 'Dewa 19', genre: 'Rock' },
  { artist_id: '88888888-0000-0000-0000-000000000004', name: 'Raisa', genre: 'Pop' },
  { artist_id: '88888888-0000-0000-0000-000000000005', name: 'Isyana Sarasvati', genre: 'Pop Klasik' },
  { artist_id: '88888888-0000-0000-0000-000000000006', name: 'Maliq & D Essentials', genre: 'Jazz/Pop' },
  { artist_id: '88888888-0000-0000-0000-000000000007', name: 'Noah', genre: 'Pop Rock' },
  { artist_id: '88888888-0000-0000-0000-000000000008', name: 'Pamungkas', genre: 'Indie Pop' },
];

// Simulasi role: ganti ke 'customer' atau 'organizer' untuk test tampilan non-admin
const CURRENT_ROLE = 'customer';

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>(DUMMY_ARTISTS);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Artist | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Artist | null>(null);

  const isAdmin = CURRENT_ROLE === 'admin';

  const filtered = [...artists]
    .filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.genre.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const uniqueGenres = new Set(artists.map((a) => a.genre)).size;
  const appearedInEvents = artists.length;

  function handleCreate(data: { name: string; genre: string }) {
    const newArtist: Artist = {
      artist_id: crypto.randomUUID(),
      name: data.name,
      genre: data.genre,
    };
    setArtists((prev) => [...prev, newArtist]);
    setModalOpen(false);
  }

  function handleUpdate(data: { name: string; genre: string }) {
    if (!editTarget) return;
    setArtists((prev) =>
      prev.map((a) =>
        a.artist_id === editTarget.artist_id ? { ...a, ...data } : a
      )
    );
    setEditTarget(null);
    setModalOpen(false);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setArtists((prev) => prev.filter((a) => a.artist_id !== deleteTarget.artist_id));
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
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

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Total Artis</p>
            <p className="text-3xl font-bold text-white">{artists.length}</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Genre</p>
            <p className="text-3xl font-bold text-white">{uniqueGenres}</p>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-6">
            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Tampil di Event</p>
            <p className="text-3xl font-bold text-white">{appearedInEvents}</p>
          </div>
        </div>

        <ArtistTable
          artists={filtered}
          isAdmin={isAdmin}
          search={search}
          onSearchChange={setSearch}
          onEdit={(artist) => { setEditTarget(artist); setModalOpen(true); }}
          onDelete={(artist) => setDeleteTarget(artist)}
        />
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