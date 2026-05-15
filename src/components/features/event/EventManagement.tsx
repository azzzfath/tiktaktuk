"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { EventFormModal } from "@/components/features/event/EventFormModal";
import { EventDeleteModal } from "@/components/features/event/EventDeleteModal";
import type { Event } from "@/types";
import { UserRole } from "@/types/auth";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

interface EventManagementProps {
  role: UserRole;
}

export function EventManagement({ role }: EventManagementProps) {
  const canManage = role === "administrator" || role === "organizer";

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil data event:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitEvent(data: Partial<Event>) {
    const isEditing = !!selectedEvent;
    const url = isEditing ? `/api/events/${selectedEvent.event_id}` : "/api/events";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      await fetchEvents();
      setIsFormOpen(false);
      setSelectedEvent(null);
    }
  }

  async function handleDeleteConfirm() {
    if (!selectedEvent) return;
    const res = await fetch(`/api/events/${selectedEvent.event_id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      await fetchEvents();
      setIsDeleteOpen(false);
      setSelectedEvent(null);
    }
  }

  const filteredEvents = events.filter((e) =>
    e.event_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Kembali ke Dashboard</span>
      </Link>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Manajemen Acara</h1>
            <p className="text-zinc-500 text-sm">Kelola daftar acara, jadwal, dan artis yang tampil</p>
          </div>
          {canManage && (
            <Button onClick={() => { setSelectedEvent(null); setIsFormOpen(true); }} className="flex items-center gap-2 bg-[#6366F1] text-white">
              <Plus className="w-4 h-4" /> Buat Acara
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 flex flex-col gap-1 bg-[#1A1A1A] border-white/10">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Acara</span>
            <span className="text-2xl font-bold text-white">{loading ? "..." : events.length}</span>
          </Card>
          <Card className="p-4 flex flex-col gap-1 bg-[#1A1A1A] border-white/10">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Status Aktif</span>
            <span className="text-2xl font-bold text-white">Live</span>
          </Card>
          <Card className="p-4 flex flex-col gap-1 bg-[#1A1A1A] border-white/10">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Wilayah</span>
            <span className="text-2xl font-bold text-white">Nasional</span>
          </Card>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input 
            className="pl-10 bg-[#1A1A1A] border-white/10 text-white" 
            placeholder="Cari nama acara..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-center text-zinc-500 py-10 col-span-full">Memuat data acara...</div>
        ) : filteredEvents.map((event) => (
          <Card key={event.event_id} className="flex flex-col p-5 bg-[#1A1A1A] border-white/10">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white mb-2">{event.event_title}</h2>
              <div className="flex flex-wrap gap-1">
                {event.artists?.map(artist => (
                  <Badge key={artist} variant="primary" className="text-[10px]">{artist}</Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-3 mb-6 flex-1">
              <div className="flex items-center gap-2 text-zinc-400">
                <Calendar className="w-4 h-4 shrink-0" />
                <span className="text-sm">{event.event_date} • {event.event_time}</span>
              </div>
              <div className="flex items-start gap-2 text-zinc-400">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-sm line-clamp-2">{event.venue_id}</span>
              </div>
            </div>

            {canManage && (
              <div className="pt-4 border-t border-white/10 mt-auto flex gap-2">
                <Button 
                  variant="ghost" 
                  className="w-full bg-white/5 border border-white/10 flex justify-center items-center gap-2 text-xs text-white" 
                  onClick={() => { setSelectedEvent(event); setIsFormOpen(true); }}
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full bg-white/5 border border-white/10 text-[#EF4444] hover:bg-[#EF4444]/10 flex justify-center items-center gap-2 text-xs" 
                  onClick={() => { setSelectedEvent(event); setIsDeleteOpen(true); }}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {isFormOpen && (
        <EventFormModal 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          initialData={selectedEvent} 
          onSubmit={handleSubmitEvent}
        />
      )}

      {isDeleteOpen && (
        <EventDeleteModal 
          isOpen={isDeleteOpen} 
          onClose={() => setIsDeleteOpen(false)} 
          onConfirm={handleDeleteConfirm} 
        />
      )}
    </section>
  );
}