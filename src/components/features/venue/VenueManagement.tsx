"use client";

import { useState, useEffect } from "react";
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

interface VenueManagementProps {
  role: UserRole;
}

export function VenueManagement({ role }: VenueManagementProps) {
  const canManage = role === "administrator" || role === "organizer";

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  // Fungsi Fetch Data
  const fetchVenues = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/venues");
      const data = await res.json();
      setVenues(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil data venue:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const filteredVenues = venues.filter(v => 
    v.venue_name.toLowerCase().includes(search.toLowerCase()) ||
    v.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Manajemen Venue</h1>
            <p className="text-zinc-500 text-sm">Kelola lokasi pertunjukan dan kapasitas tempat duduk</p>
          </div>
          {canManage && (
            <Button onClick={() => { setSelectedVenue(null); setIsFormOpen(true); }} className="flex items-center gap-2 bg-[#6366F1] hover:bg-[#4F46E5]">
              <Plus className="w-4 h-4" /> Tambah Venue
            </Button>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 flex flex-col gap-1 border-white/5 bg-[#1A1A1A]">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Venue</span>
            <span className="text-2xl font-bold">{venues.length}</span>
          </Card>
          <Card className="p-4 flex flex-col gap-1 border-white/5 bg-[#1A1A1A]">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Reserved Seating</span>
            <span className="text-2xl font-bold">{venues.filter(v => v.hasReservedSeating).length}</span>
          </Card>
          <Card className="p-4 flex flex-col gap-1 border-white/5 bg-[#1A1A1A]">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Kapasitas</span>
            <span className="text-2xl font-bold">
              {venues.reduce((acc, curr) => acc + curr.capacity, 0).toLocaleString()}
            </span>
          </Card>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            className="pl-10 bg-[#1A1A1A] border-white/10" 
            placeholder="Cari nama atau alamat..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-zinc-500 py-10">Memuat data venue...</p>
        ) : filteredVenues.map((venue) => (
          <Card key={venue.venue_id} className="p-5 flex flex-col md:flex-row md:items-center gap-6 border-white/5 bg-[#1A1A1A] hover:border-white/10 transition-colors">
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

            {canManage && (
              <div className="flex flex-row md:flex-col gap-2">
                <Button
                  variant="ghost"
                  onClick={() => { setSelectedVenue(venue); setIsFormOpen(true); }}
                  className="bg-white/5 border border-white/10 text-xs px-3 py-1.5 h-auto flex gap-2 items-center hover:bg-white/10"
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

      <VenueFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={fetchVenues}
        initialData={selectedVenue} 
      />
      <VenueDeleteModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onSuccess={fetchVenues}
        venueId={selectedVenue?.venue_id} 
      />
    </section>
  );
}