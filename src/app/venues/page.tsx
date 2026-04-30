"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { VenueFormModal } from "@/components/features/venue/VenueFormModal";
import { VenueDeleteModal } from "@/components/features/venue/VenueDeleteModal";
import type { Venue } from "@/types";
import { MapPin, Users, Plus, Pencil, Trash2 } from "lucide-react";

// Mock data sementara agar halamannya tidak kosong
const mockVenues: Venue[] = [
  {
    venue_id: "55555555-0000-0000-0000-000000000001",
    venue_name: "Gelora Bung Karno",
    capacity: 77000,
    address: "Jl. Pintu Satu Senayan",
    city: "Jakarta",
    hasReservedSeating: true,
  },
  {
    venue_id: "55555555-0000-0000-0000-000000000002",
    venue_name: "ICE BSD",
    capacity: 10000,
    address: "BSD City",
    city: "Tangerang",
    hasReservedSeating: false,
  },
];

export default function VenueListPage() {
  // Hardcode role untuk testing UI. Nanti diganti dengan data Auth.
  // Coba ganti jadi "customer" untuk melihat state dimana tombol edit/delete/tambah hilang.
  const userRole = "admin"; 
  const canManage = userRole === "admin" || userRole === "organizer";

  // State untuk mengontrol Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  // Fungsi pembantu untuk membuka modal
  const handleOpenCreate = () => {
    setSelectedVenue(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsDeleteOpen(true);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Bagian Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#F4F4F5]">Daftar Venue</h1>
          <p className="text-zinc-500 mt-2">Kelola dan jelajahi lokasi penyelenggaraan acara.</p>
        </div>
        
        {/* Tombol Tambah hanya muncul kalau rolenya admin/organizer */}
        {canManage && (
          <Button variant="primary" className="flex items-center gap-2" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4" />
            Tambah Venue
          </Button>
        )}
      </div>

      {/* Grid Card Venue */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVenues.map((venue) => (
          <Card key={venue.venue_id} className="flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-[#F4F4F5] line-clamp-1">{venue.venue_name}</h2>
              <Badge variant="primary" className="shrink-0">{venue.city}</Badge>
            </div>
            
            <div className="space-y-3 mb-6 flex-1">
              <div className="flex items-center gap-2 text-zinc-400">
                <Users className="w-4 h-4 shrink-0" />
                <span className="text-sm">Kapasitas: {venue.capacity.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-400">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-sm line-clamp-2">{venue.address}</span>
              </div>
              {venue.hasReservedSeating && (
                <Badge variant="success" className="mt-2">Reserved Seating</Badge>
              )}
            </div>

            {/* Tombol Aksi di dalam Card */}
            {canManage && (
              <div className="flex gap-2 pt-4 border-t border-white/10 mt-auto">
                <Button variant="secondary" className="w-full flex justify-center items-center gap-2" onClick={() => handleOpenEdit(venue)}>
                  <Pencil className="w-4 h-4" /> Edit
                </Button>
                <Button variant="danger" className="w-full flex justify-center items-center gap-2" onClick={() => handleOpenDelete(venue)}>
                  <Trash2 className="w-4 h-4" /> Hapus
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Komponen Modal yang disembunyikan (akan muncul saat state isOpen = true) */}
      <VenueFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedVenue} 
      />
      <VenueDeleteModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={() => {
          console.log("Hapus venue:", selectedVenue?.venue_id);
          setIsDeleteOpen(false); // Tutup modal setelah konfirmasi
        }} 
      />
    </main>
  );
}