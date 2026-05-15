"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ErrorBanner } from "@/components/features/ticket-seat/ErrorBanner";
import { ManagementStats } from "@/components/features/ticket-seat/ManagementStats";
import { TicketDeleteModal } from "@/components/features/ticket-seat/TicketDeleteModal";
import { TicketFormModal } from "@/components/features/ticket-seat/TicketFormModal";
import { TicketTable } from "@/components/features/ticket-seat/TicketTable";
import { ManagementPermissions, TicketOptions, TicketRecord } from "@/types/ticket-seat";

const emptyOptions: TicketOptions = { orders: [], categories: [], seats: [] };

interface TicketManagementProps {
  permissions: ManagementPermissions;
}

export function TicketManagement({ permissions }: TicketManagementProps) {
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [options, setOptions] = useState<TicketOptions>(emptyOptions);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TicketRecord | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [ticketRes, optionRes] = await Promise.all([fetch("/api/tickets"), fetch("/api/tickets/options")]);
      const ticketData = await ticketRes.json();
      const optionData = await optionRes.json();

      if (!ticketRes.ok) throw new Error(ticketData.error || "Gagal memuat tiket.");
      if (!optionRes.ok) throw new Error(optionData.error || "Gagal memuat opsi tiket.");

      setTickets(ticketData);
      setOptions(optionData);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Gagal memuat tiket.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTickets = useMemo(() => {
    return tickets
      .filter((ticket) => `${ticket.ticket_code} ${ticket.event_title}`.toLowerCase().includes(search.toLowerCase()))
      .filter((ticket) => (status === "ALL" ? true : ticket.status === status));
  }, [search, status, tickets]);

  const submitTicket = async (payload: { order_id?: string; category_id?: string; seat_id?: string }) => {
    const url = modalMode === "edit" && selectedTicket ? `/api/tickets/${selectedTicket.ticket_id}` : "/api/tickets";
    const res = await fetch(url, {
      method: modalMode === "edit" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Gagal menyimpan tiket.");
      return;
    }

    setModalMode(null);
    setSelectedTicket(null);
    await loadData();
  };

  const deleteTicket = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/tickets/${deleteTarget.ticket_id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Gagal menghapus tiket.");
      return;
    }

    setDeleteTarget(null);
    await loadData();
  };

  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Link href="/dashboard" className="inline-flex w-fit items-center gap-2 text-zinc-500 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>
          <h1 className="text-3xl font-bold">{permissions.role === "customer" ? "Tiket Saya" : "Manajemen Tiket"}</h1>
          <p className="text-sm text-zinc-400">Kelola tiket berdasarkan order, kategori tiket, dan kursi.</p>
        </div>
        {permissions.canCreateTicket && (
          <Button className="inline-flex items-center gap-2" onClick={() => {
            setSelectedTicket(null);
            setModalMode("create");
          }}>
            <Plus className="h-4 w-4" />
            Tambah Tiket
          </Button>
        )}
      </div>

      {error && <ErrorBanner message={error} />}
      <ManagementStats items={[
        { label: "Total Tiket", value: filteredTickets.length },
        { label: "Valid", value: filteredTickets.filter((ticket) => ticket.status === "VALID").length },
        { label: "Kedaluwarsa", value: filteredTickets.filter((ticket) => ticket.status === "KADALUWARSA").length },
      ]} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input className="pl-9" placeholder="Cari kode tiket atau nama event..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className="sm:w-56">
          <Select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="ALL" className="bg-[#1A1A1A]">Semua Status</option>
            <option value="VALID" className="bg-[#1A1A1A]">Valid</option>
            <option value="KADALUWARSA" className="bg-[#1A1A1A]">Kedaluwarsa</option>
          </Select>
        </div>
      </div>
      {loading ? <p className="text-zinc-500">Memuat tiket...</p> : (
        <TicketTable tickets={filteredTickets} canManage={permissions.canManageTicket} onEdit={(ticket) => {
          setSelectedTicket(ticket);
          setModalMode("edit");
        }} onDelete={setDeleteTarget} />
      )}
      <TicketFormModal isOpen={Boolean(modalMode)} mode={modalMode ?? "create"} ticket={selectedTicket} options={options} onClose={() => {
        setModalMode(null);
        setSelectedTicket(null);
      }} onSubmit={submitTicket} />
      <TicketDeleteModal ticket={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={deleteTicket} />
    </section>
  );
}
