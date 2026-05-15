"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { TicketCard, TicketData } from "./TicketCard";
import { UpdateTicketModal } from "./UpdateTicketModal";
import { DeleteTicketAlert } from "./DeleteTicketAlert";

const INITIAL_MOCK_TICKETS: TicketData[] = [
  {
    id: "t1",
    code: "TTK-EVT001-VIP-001",
    eventName: "Konser Melodi Senja",
    category: "VIP",
    status: "VALID",
    date: "2024-05-15 19:00",
    venue: "Jakarta Convention Center",
    seat: "VIP B-1",
    price: 750000,
    orderId: "ord_001",
    customerName: "Budi Santoso",
  },
  {
    id: "t2",
    code: "TTK-EVT001-VIP-002",
    eventName: "Konser Melodi Senja",
    category: "VIP",
    status: "TERPAKAI",
    date: "2024-05-15 19:00",
    venue: "Jakarta Convention Center",
    seat: "VIP B-2",
    price: 750000,
    orderId: "ord_001",
    customerName: "Budi Santoso",
  },
  {
    id: "t3",
    code: "TTK-EVT002-FES-010",
    eventName: "Festival Seni Budaya",
    category: "Festival",
    status: "VALID",
    date: "2024-06-20 10:00",
    venue: "Taman Ismail Marzuki",
    price: 150000,
    orderId: "ord_002",
    customerName: "Siti Aminah",
  },
  {
    id: "t4",
    code: "TTK-EVT002-FES-011",
    eventName: "Festival Seni Budaya",
    category: "Festival",
    status: "KADALUWARSA",
    date: "2024-06-20 10:00",
    venue: "Taman Ismail Marzuki",
    price: 150000,
    orderId: "ord_002",
    customerName: "Siti Aminah",
  }
];

interface TicketListPageProps {
  userRole: 'CUSTOMER' | 'ADMIN' | 'ORGANIZER';
  onOpenCreateTicket?: () => void;
}

export function TicketListPage({ userRole, onOpenCreateTicket }: TicketListPageProps) {
  const isAdminOrOrganizer = userRole === 'ADMIN' || userRole === 'ORGANIZER';
  
  const [tickets, setTickets] = useState<TicketData[]>(INITIAL_MOCK_TICKETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  // Modals state
  const [ticketToEdit, setTicketToEdit] = useState<TicketData | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<string | null>(null);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch = 
        ticket.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ticket.eventName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "Semua Status" || ticket.status === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchQuery, statusFilter]);

  const totalTiket = filteredTickets.length;
  const validTiket = filteredTickets.filter(t => t.status === "VALID").length;
  const terpakaiTiket = filteredTickets.filter(t => t.status === "TERPAKAI").length;

  const handleSaveEdit = (updatedTicket: TicketData) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setTicketToEdit(null);
  };

  const handleConfirmDelete = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
    setTicketToDelete(null);
  };

  return (
    <div className="max-w-5xl mx-auto w-full flex flex-col gap-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isAdminOrOrganizer ? "Manajemen Tiket" : "Tiket Saya"}
          </h1>
          <p className="text-sm text-zinc-400">
            {isAdminOrOrganizer 
              ? "Kelola tiket: tambah, ubah status, dan hapus tiket" 
              : "Kelola dan akses tiket pertunjukan Anda"}
          </p>
        </div>
        {isAdminOrOrganizer && (
          <Button variant="primary" onClick={onOpenCreateTicket} className="self-start">
            + Tambah Tiket
          </Button>
        )}
      </div>

      {/* STAT CARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Tiket" value={totalTiket} />
        <StatCard title="Valid" value={validTiket} />
        <StatCard title="Terpakai" value={terpakaiTiket} />
      </div>

      {/* FILTER SECTION */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            placeholder="Cari kode tiket atau nama acara..." 
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="bg-surface-dark border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none w-full sm:w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="Semua Status">Semua Status</option>
          <option value="Valid">Valid</option>
          <option value="Terpakai">Terpakai</option>
          <option value="Kadaluwarsa">Kadaluwarsa</option>
          <option value="Batal">Batal</option>
        </select>
      </div>

      {/* TICKETS LIST */}
      <div className="flex flex-col gap-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-surface-dark border border-white/10 rounded-xl p-12 text-center flex flex-col items-center justify-center">
             <p className="text-zinc-400">Tidak ada tiket yang ditemukan.</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket} 
              userRole={userRole} 
              onEdit={setTicketToEdit}
              onDelete={setTicketToDelete}
            />
          ))
        )}
      </div>

      {/* MODALS */}
      <UpdateTicketModal 
        isOpen={!!ticketToEdit}
        onClose={() => setTicketToEdit(null)}
        ticket={ticketToEdit}
        onSave={handleSaveEdit}
      />

      <DeleteTicketAlert 
        isOpen={!!ticketToDelete}
        onClose={() => setTicketToDelete(null)}
        ticketId={ticketToDelete}
        onConfirmDelete={handleConfirmDelete}
      />

    </div>
  );
}
