"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { VenueFormModal } from "@/components/features/venue/VenueFormModal";
import { VenueDeleteModal } from "@/components/features/venue/VenueDeleteModal";
import type { Venue } from "@/types";
import { UserRole } from "@/types/auth";
import {
  MapPin,
  Users,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronDown,
  Building2,
} from "lucide-react";

const mockVenues: Venue[] = [
  {
    venue_id: "1",
    venue_name: "Jakarta Convention Center",
    capacity: 1000,
    address: "Jl. Gatot Subroto No.1",
    city: "Jakarta",
    hasReservedSeating: true,
  },
  {
    venue_id: "2",
    venue_name: "Taman Impian Jayakarta",
    capacity: 500,
    address: "Jl. Lodan Timur No.7",
    city: "Jakarta Utara",
    hasReservedSeating: false,
  },
  {
    venue_id: "3",
    venue_name: "Bandung Hall Center",
    capacity: 800,
    address: "Jl. Asia Afrika",
    city: "Bandung",
    hasReservedSeating: true,
  },
];

interface VenueManagementProps {
  role: UserRole;
}

export function VenueManagement({ role }: VenueManagementProps) {
  const canManage = role === "administrator" || role === "organizer";

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & Stats Cards */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Manajemen Venue</h1>
            <p className="text-zinc-500 text-sm">Kelola lokasi pertunjukan dan kapasitas tempat duduk</p>
          </div>
          {canManage && (
            <Button onClick={() => { setSelectedVenue(null); setIsFormOpen(true); }} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Tambah Venue
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Venue</span>
            <span className="text-2xl font-bold">3</span>
          </Card>
          <Card className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Reserved Seating</span>
            <span className="text-2xl font-bold">2</span>
          </Card>
          <Card className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Kapasitas</span>
            <span className="text-2xl font-bold">2,300</span>
          </Card>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input className="pl-10" placeholder="Cari nama atau alamat..." />
        </div>
        <Button variant="ghost" className="border border-white/10 bg-[#1A1A1A] text-zinc-400 flex justify-between gap-4 min-w-[140px]">
          Semua Kota <ChevronDown className="w-4 h-4" />
        </Button>
        <Button variant="ghost" className="border border-white/10 bg-[#1A1A1A] text-zinc-400 flex justify-between gap-4 min-w-[160px]">
          Semua Tipe Seating <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Venue List Items */}
      <div className="space-y-4">
        {mockVenues.map((venue) => (
          <Card key={venue.venue_id} className="p-5 flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-12 h-12 rounded-lg bg-[#6366F1]/10 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-[#6366F1]" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-bold text-white text-lg">{venue.venue_name}</h3>
                <Badge variant={venue.hasReservedSeating ? "primary" : "muted"} className="text-[10px] uppercase">
                  {venue.hasReservedSeating ? "✓ Reserved Seating" : "⊘ Free Seating"}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-500 text-sm mb-4">
                <MapPin className="w-3.5 h-3.5" />
                <span>{venue.address}, {venue.city}</span>
              </div>

              <div className="bg-[#0F0F0F] rounded-lg p-3 inline-block min-w-[200px]">
                <span className="text-[10px] font-bold text-zinc-600 uppercase block mb-1">Kapasitas</span>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Users className="w-4 h-4" /> {venue.capacity.toLocaleString()} Kursi
                </div>
              </div>
            </div>

            {/* Tombol Aksi - Hanya untuk Admin/Organizer */}
            {canManage && (
              <div className="flex flex-row md:flex-col gap-2">
                <Button
                  variant="ghost"
                  onClick={() => { setSelectedVenue(venue); setIsFormOpen(true); }}
                  className="bg-white/5 border border-white/10 text-xs px-3 py-1.5 h-auto flex gap-2 items-center"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => { setSelectedVenue(venue); setIsDeleteOpen(true); }}
                  className="bg-white/5 border border-white/10 text-[#EF4444] text-xs px-3 py-1.5 h-auto flex gap-2 items-center hover:bg-[#EF4444]/10"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      <VenueFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} initialData={selectedVenue} />
      <VenueDeleteModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={() => setIsDeleteOpen(false)} />
    </section>
  );
}
