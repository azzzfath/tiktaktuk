"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { VenueFormModal } from "@/components/features/venue/VenueFormModal";
import { VenueDeleteModal } from "@/components/features/venue/VenueDeleteModal";
import { useToast } from "@/hooks/useToast";
import type { Venue, VenueFormValues } from "@/types";
import { UserRole } from "@/types/auth";
import {
  MapPin,
  Users,
  Plus,
  Pencil,
  Trash2,
  Search,
  Building2,
} from "lucide-react";

interface VenueManagementProps {
  role: UserRole;
}

export function VenueManagement({ role }: VenueManagementProps) {
  const canManage = role === "administrator" || role === "organizer";
  const { toast } = useToast();

  const [venues, setVenues] = useState<Venue[]>([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("ALL");
  const [seatingFilter, setSeatingFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  useEffect(() => {
    let active = true;

    async function loadVenues() {
      try {
        const response = await fetch("/api/venues");
        if (!response.ok) throw new Error(await readError(response));
        const data = (await response.json()) as Venue[];
        if (active) setVenues(data);
      } catch (error) {
        if (active) toast(error instanceof Error ? error.message : "Gagal memuat venue.", "error");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadVenues();
    return () => {
      active = false;
    };
  }, [toast]);

  const cities = useMemo(() => Array.from(new Set(venues.map((venue) => venue.city))), [venues]);

  const filteredVenues = useMemo(() => {
    return venues
      .filter((venue) => {
        const term = search.trim().toLowerCase();
        if (!term) return true;
        return (
          venue.venue_name.toLowerCase().includes(term) ||
          venue.address.toLowerCase().includes(term)
        );
      })
      .filter((venue) => (cityFilter === "ALL" ? true : venue.city === cityFilter))
      .filter((venue) => {
        if (seatingFilter === "ALL") return true;
        return seatingFilter === "RESERVED" ? venue.hasReservedSeating : !venue.hasReservedSeating;
      });
  }, [cityFilter, search, seatingFilter, venues]);

  const reservedCount = venues.filter((venue) => venue.hasReservedSeating).length;
  const totalCapacity = venues.reduce((sum, venue) => sum + venue.capacity, 0);

  const handleSubmitVenue = async (values: VenueFormValues) => {
    try {
      const url = selectedVenue ? `/api/venues/${selectedVenue.venue_id}` : "/api/venues";
      const response = await fetch(url, {
        method: selectedVenue ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(await readError(response));
      const venue = (await response.json()) as Venue;

      if (selectedVenue) {
        setVenues((prev) => prev.map((item) => (item.venue_id === venue.venue_id ? venue : item)));
        toast(`Venue ${venue.venue_name} berhasil diperbarui.`, "success");
      } else {
        setVenues((prev) => [...prev, venue]);
        toast(`Venue ${venue.venue_name} berhasil dibuat.`, "success");
      }

      setIsFormOpen(false);
      setSelectedVenue(null);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Gagal menyimpan venue.", "error");
    }
  };

  const handleDeleteVenue = async () => {
    if (!selectedVenue) return;

    try {
      const response = await fetch(`/api/venues/${selectedVenue.venue_id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(await readError(response));
      setVenues((prev) => prev.filter((venue) => venue.venue_id !== selectedVenue.venue_id));
      toast(`Venue ${selectedVenue.venue_name} berhasil dihapus.`, "success");
      setIsDeleteOpen(false);
      setSelectedVenue(null);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Gagal menghapus venue.", "error");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
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
            <span className="text-2xl font-bold">{venues.length}</span>
          </Card>
          <Card className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Reserved Seating</span>
            <span className="text-2xl font-bold">{reservedCount}</span>
          </Card>
          <Card className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Kapasitas</span>
            <span className="text-2xl font-bold">{totalCapacity.toLocaleString("id-ID")}</span>
          </Card>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            className="pl-10"
            placeholder="Cari nama atau alamat..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="md:w-48">
          <Select value={cityFilter} onChange={(event) => setCityFilter(event.target.value)}>
            <option value="ALL" className="bg-[#1A1A1A]">Semua Kota</option>
            {cities.map((city) => (
              <option key={city} value={city} className="bg-[#1A1A1A]">{city}</option>
            ))}
          </Select>
        </div>
        <div className="md:w-56">
          <Select value={seatingFilter} onChange={(event) => setSeatingFilter(event.target.value)}>
            <option value="ALL" className="bg-[#1A1A1A]">Semua Tipe Seating</option>
            <option value="RESERVED" className="bg-[#1A1A1A]">Reserved Seating</option>
            <option value="FREE" className="bg-[#1A1A1A]">Free Seating</option>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <Card className="p-12 text-center">
            <p className="text-zinc-400">Memuat data venue...</p>
          </Card>
        ) : filteredVenues.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-zinc-400">Tidak ada venue yang cocok dengan filter.</p>
          </Card>
        ) : filteredVenues.map((venue) => (
          <Card key={venue.venue_id} className="p-5 flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-12 h-12 rounded-lg bg-[#6366F1]/10 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-[#6366F1]" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-bold text-white text-lg">{venue.venue_name}</h3>
                <Badge variant={venue.hasReservedSeating ? "primary" : "muted"} className="text-[10px] uppercase">
                  {venue.hasReservedSeating ? "Reserved Seating" : "Free Seating"}
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

      <VenueFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={selectedVenue}
        onSubmit={handleSubmitVenue}
      />
      <VenueDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteVenue}
      />
    </section>
  );
}

async function readError(response: Response) {
  const payload = await response.json().catch(() => null) as { error?: string; message?: string } | null;
  return payload?.error ?? payload?.message ?? "Request gagal.";
}
