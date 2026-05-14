"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EventFormModal } from "@/components/features/event/EventFormModal";
import { EventDeleteModal } from "@/components/features/event/EventDeleteModal";
import type { Event } from "@/types";
import { Plus, Calendar, MapPin, Pencil, Trash2 } from "lucide-react"; 

// Mock Data
const mockEvents: Event[] = [
  {
    event_id: "1",
    event_title: "Konser Melodi Senja",
    event_date: "2024-05-15",
    event_time: "19:00",
    venue_id: "Jakarta Convention Center",
    artists: ["Fourtwnty", "Hindia"],
    categories: [{ name: "VIP", price: 750000, quota: 150 }],
    description: "Nikmati suasana senja dengan alunan musik indie.",
  }
];

export default function MyEventsPage() {
  // State untuk form (Create/Update)
  const [isFormOpen, setIsFormOpen] = useState(false);
  // State untuk konfirmasi Delete
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleOpenCreate = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteOpen(true);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Acara Saya</h1>
          <p className="text-zinc-500 mt-2">Kelola daftar acara yang Anda selenggarakan.</p>
        </div>
        
        <Button variant="primary" className="flex items-center gap-2" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4" />
          Buat Acara
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEvents.map((event) => (
          <Card key={event.event_id} className="flex flex-col">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-white mb-2">{event.event_title}</h2>
              <div className="flex flex-wrap gap-1">
                {event.artists.map(artist => (
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

            {/* Aksi CUD - Edit dan Hapus dibuat berdampingan */}
            <div className="pt-4 border-t border-white/10 mt-auto flex gap-2">
              <Button 
                variant="secondary" 
                className="w-full flex justify-center items-center gap-2" 
                onClick={() => handleOpenEdit(event)}
              >
                <Pencil className="w-4 h-4" /> Edit
              </Button>
              <Button 
                variant="danger" 
                className="w-full flex justify-center items-center gap-2" 
                onClick={() => handleOpenDelete(event)}
              >
                <Trash2 className="w-4 h-4" /> Hapus
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Render Modals */}
      <EventFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedEvent} 
      />
      <EventDeleteModal 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={() => {
          // Logika hapus dari API nanti ditaruh di sini
          console.log("Hapus event dengan ID:", selectedEvent?.event_id);
          setIsDeleteOpen(false);
        }} 
      />
    </main>
  );
}