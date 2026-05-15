"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { SeatTable, Seat } from "./SeatTable";
import { CreateSeatModal } from "./CreateSeatModal";
import { UpdateSeatModal } from "./UpdateSeatModal";
import { DeleteSeatAlert } from "./DeleteSeatAlert";

const INITIAL_MOCK_SEATS: Seat[] = [
  { id: "s1", venueName: "Jakarta Convention Center", section: "WVIP", row: "A", seatNumber: "1", status: "TERISI" },
  { id: "s2", venueName: "Jakarta Convention Center", section: "WVIP", row: "A", seatNumber: "2", status: "TERSEDIA" },
  { id: "s3", venueName: "Jakarta Convention Center", section: "WVIP", row: "A", seatNumber: "3", status: "TERSEDIA" },
  { id: "s4", venueName: "Jakarta Convention Center", section: "VIP", row: "B", seatNumber: "1", status: "TERISI" },
  { id: "s5", venueName: "Jakarta Convention Center", section: "VIP", row: "B", seatNumber: "2", status: "TERISI" },
  { id: "s6", venueName: "Jakarta Convention Center", section: "VIP", row: "B", seatNumber: "3", status: "TERSEDIA" },
  { id: "s7", venueName: "Jakarta Convention Center", section: "Category 1", row: "C", seatNumber: "1", status: "TERSEDIA" },
];

export const MOCK_VENUES = [
  "Jakarta Convention Center",
  "Taman Ismail Marzuki",
  "Istora Senayan"
];

interface SeatListPageProps {
  userRole: 'CUSTOMER' | 'ADMIN' | 'ORGANIZER';
}

export function SeatListPage({ userRole }: SeatListPageProps) {
  const isAdminOrOrganizer = userRole === 'ADMIN' || userRole === 'ORGANIZER';
  
  const [seats, setSeats] = useState<Seat[]>(INITIAL_MOCK_SEATS);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [venueFilter, setVenueFilter] = useState("Semua Venue");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [seatToEdit, setSeatToEdit] = useState<Seat | null>(null);
  const [seatToDelete, setSeatToDelete] = useState<Seat | null>(null);

  const filteredSeats = useMemo(() => {
    return seats.filter((seat) => {
      const matchesSearch = 
        seat.section.toLowerCase().includes(searchQuery.toLowerCase()) || 
        seat.row.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seat.seatNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesVenue = venueFilter === "Semua Venue" || seat.venueName === venueFilter;

      return matchesSearch && matchesVenue;
    });
  }, [seats, searchQuery, venueFilter]);

  // Derived stats
  const totalKursi = filteredSeats.length;
  const tersediaKursi = filteredSeats.filter(s => s.status === 'TERSEDIA').length;
  const terisiKursi = filteredSeats.filter(s => s.status === 'TERISI').length;

  // Handlers
  const handleCreateSubmit = (data: any) => {
    const newSeat: Seat = {
      ...data,
      id: `s${Date.now()}`,
      venueName: MOCK_VENUES.find(v => v.includes(data.venueId)) || "Jakarta Convention Center", // Simplified mapping for mock
      status: "TERSEDIA",
    };
    setSeats([...seats, newSeat]);
  };

  const handleUpdateSubmit = (updatedSeatData: any) => {
    const venueName = MOCK_VENUES.find(v => v.includes(updatedSeatData.venueId)) || updatedSeatData.venueName || "Jakarta Convention Center";
    
    const finalUpdated: Seat = {
      ...updatedSeatData,
      venueName
    };
    setSeats(seats.map(s => s.id === finalUpdated.id ? finalUpdated : s));
  };

  const handleConfirmDelete = (id: string) => {
    setSeats(seats.filter(s => s.id !== id));
    setSeatToDelete(null);
  };

  const handleDeleteClick = (seat: Seat) => {
    if (seat.status === "TERISI") {
      alert("Kursi ini sudah di-assign ke tiket dan tidak dapat dihapus. Hapus atau ubah tiket terlebih dahulu.");
      return;
    }
    setSeatToDelete(seat);
  };

  return (
    <div className="max-w-6xl mx-auto w-full flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Manajemen Kursi</h1>
          <p className="text-sm text-zinc-400">Kelola kursi dan denah tempat duduk venue</p>
        </div>
        {isAdminOrOrganizer && (
          <Button variant="primary" onClick={() => setIsCreateOpen(true)} className="self-start">
            + Tambah Kursi
          </Button>
        )}
      </div>

      {/* STAT CARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Kursi" value={totalKursi} />
        <StatCard title="Tersedia" value={tersediaKursi} />
        <StatCard title="Terisi" value={terisiKursi} />
      </div>

      {/* FILTER SECTION */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Cari section, baris, atau nomor..." 
            className="pl-10 w-full bg-[#1A1A1A] border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none w-full sm:w-64"
          value={venueFilter}
          onChange={(e) => setVenueFilter(e.target.value)}
        >
          <option value="Semua Venue">Semua Venue</option>
          {MOCK_VENUES.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      {/* TABLE SECTION */}
      <SeatTable 
        seats={filteredSeats} 
        userRole={userRole} 
        onEdit={setSeatToEdit}
        onDelete={handleDeleteClick}
      />

      {/* MODALS */}
      <CreateSeatModal 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <UpdateSeatModal 
        isOpen={!!seatToEdit}
        onClose={() => setSeatToEdit(null)}
        seat={seatToEdit as any} // using generic type cast here since internal SeatData vs Seat differs slightly (venueId vs venueName) in our quick mock.
        onSubmit={handleUpdateSubmit}
      />

      <DeleteSeatAlert 
        isOpen={!!seatToDelete}
        onClose={() => setSeatToDelete(null)}
        seatId={seatToDelete?.id || null}
        onConfirmDelete={handleConfirmDelete}
      />

    </div>
  );
}
