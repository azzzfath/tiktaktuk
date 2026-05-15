"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ErrorBanner } from "@/components/features/ticket-seat/ErrorBanner";
import { ManagementStats } from "@/components/features/ticket-seat/ManagementStats";
import { SeatDeleteModal } from "@/components/features/ticket-seat/SeatDeleteModal";
import { SeatFormModal } from "@/components/features/ticket-seat/SeatFormModal";
import { SeatTable } from "@/components/features/ticket-seat/SeatTable";
import { ManagementPermissions, SeatRecord, VenueOption } from "@/types/ticket-seat";

interface SeatManagementProps {
  permissions: ManagementPermissions;
}

export function SeatManagement({ permissions }: SeatManagementProps) {
  const [seats, setSeats] = useState<SeatRecord[]>([]);
  const [venues, setVenues] = useState<VenueOption[]>([]);
  const [search, setSearch] = useState("");
  const [venueFilter, setVenueFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formTarget, setFormTarget] = useState<SeatRecord | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SeatRecord | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [seatRes, optionRes] = await Promise.all([fetch("/api/seats"), fetch("/api/seats/options")]);
      const seatData = await seatRes.json();
      const optionData = await optionRes.json();

      if (!seatRes.ok) throw new Error(seatData.error || "Gagal memuat kursi.");
      if (!optionRes.ok) throw new Error(optionData.error || "Gagal memuat venue.");

      setSeats(seatData);
      setVenues(optionData.venues);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Gagal memuat kursi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSeats = useMemo(() => {
    return seats
      .filter((seat) => `${seat.section} ${seat.row_number} ${seat.seat_number}`.toLowerCase().includes(search.toLowerCase()))
      .filter((seat) => (venueFilter === "ALL" ? true : seat.venue_id === venueFilter));
  }, [search, seats, venueFilter]);

  const submitSeat = async (payload: { venue_id: string; section: string; row_number: string; seat_number: string }) => {
    const url = formTarget ? `/api/seats/${formTarget.seat_id}` : "/api/seats";
    const res = await fetch(url, {
      method: formTarget ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Gagal menyimpan kursi.");
      return;
    }

    setIsFormOpen(false);
    setFormTarget(null);
    await loadData();
  };

  const deleteSeat = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/seats/${deleteTarget.seat_id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Gagal menghapus kursi.");
      return;
    }

    setDeleteTarget(null);
    await loadData();
  };

  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Manajemen Kursi</h1>
          <p className="text-sm text-zinc-400">Kelola kursi dan status keterikatan dengan tiket.</p>
        </div>
        {permissions.canManageSeat && (
          <Button className="inline-flex items-center gap-2" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Tambah Kursi
          </Button>
        )}
      </div>

      {error && <ErrorBanner message={error} />}
      <ManagementStats items={[
        { label: "Total Kursi", value: filteredSeats.length },
        { label: "Tersedia", value: filteredSeats.filter((seat) => !seat.is_occupied).length },
        { label: "Terisi", value: filteredSeats.filter((seat) => seat.is_occupied).length },
      ]} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input className="pl-9" placeholder="Cari section, baris, atau nomor..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className="sm:w-64">
          <Select value={venueFilter} onChange={(event) => setVenueFilter(event.target.value)}>
            <option value="ALL" className="bg-[#1A1A1A]">Semua Venue</option>
            {venues.map((venue) => <option key={venue.venue_id} value={venue.venue_id} className="bg-[#1A1A1A]">{venue.venue_name}</option>)}
          </Select>
        </div>
      </div>
      {loading ? <p className="text-zinc-500">Memuat kursi...</p> : (
        <SeatTable seats={filteredSeats} canManage={permissions.canManageSeat} onEdit={(seat) => {
          setFormTarget(seat);
          setIsFormOpen(true);
        }} onDelete={setDeleteTarget} />
      )}
      <SeatFormModal isOpen={isFormOpen} seat={formTarget} venues={venues} onClose={() => {
        setIsFormOpen(false);
        setFormTarget(null);
      }} onSubmit={submitSeat} />
      <SeatDeleteModal seat={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={deleteSeat} />
    </section>
  );
}
