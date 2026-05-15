"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { 
  MapPin, 
  Calendar, 
  Search, 
  ChevronDown, 
  Heart,
  Music,
  Palette,
  Guitar
} from "lucide-react";
import type { Event } from "@/types";

export function ExploreContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch data dari API (Raw SQL)
  useEffect(() => {
    async function fetchPublicEvents() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Gagal memuat acara:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPublicEvents();
  }, []);

  const getStartingPrice = (categories: any[]) => {
    if (!categories || categories.length === 0) return 0;
    return Math.min(...categories.map(c => Number(c.price)));
  };

  const getEventIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("konser") || t.includes("melodi")) return <Music className="w-16 h-16 text-white/50" />;
    if (t.includes("seni") || t.includes("festival")) return <Palette className="w-16 h-16 text-white/50" />;
    return <Guitar className="w-16 h-16 text-white/50" />;
  };

  const filteredEvents = events.filter(e => 
    e.event_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#F4F4F5]">Jelajahi Acara</h1>
        <p className="text-[#71717A] mt-2">Temukan acara terbaik dan beli tiket favorit Anda</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
          <Input 
            className="pl-10 bg-[#1A1A1A] text-white border-white/10 focus:ring-[#6366F1]" 
            placeholder="Cari acara atau artis..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="ghost" className="border border-white/10 bg-[#1A1A1A] text-[#71717A] flex justify-between items-center gap-4 min-w-[160px]">
          Semua Kota <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Grid Acara */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-zinc-500 py-20">Mencari acara menarik...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="col-span-full text-center text-zinc-500 py-20">Tidak ada acara yang ditemukan.</div>
        ) : filteredEvents.map((event) => {
          const startingPrice = getStartingPrice(event.categories || []);

          return (
            <Card key={event.event_id} className="p-0 overflow-hidden flex flex-col border border-white/10 bg-[#1A1A1A] hover:border-[#6366F1]/40 transition-all group">
              {/* Banner Area */}
              <div className="h-48 bg-gradient-to-br from-[#4F46E5] to-[#6366F1] relative flex justify-center items-center">
                <button className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full p-2 transition-colors z-10">
                  <Heart className="w-5 h-5 text-white" />
                </button>
                <div className="group-hover:scale-110 transition-transform duration-500">
                  {getEventIcon(event.event_title)}
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-[#F4F4F5] mb-2">{event.event_title}</h3>
                
                {/* Info List */}
                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-[#A1A1AA] text-xs">
                    <Calendar className="w-3.5 h-3.5 text-[#6366F1]" />
                    <span>{event.event_date} • {event.event_time}</span>
                  </div>
                  <div className="flex items-start gap-2 text-[#A1A1AA] text-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#6366F1] shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{event.venue_name || "Lokasi menyusul"}</span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <div className="text-[#A1A1AA] text-[10px] uppercase font-bold tracking-wider mb-1">Mulai Dari</div>
                  <div className="text-white font-bold text-lg mb-4">
                    {startingPrice > 0 ? `Rp ${startingPrice.toLocaleString('id-ID')}` : "Segera Hadir"}
                  </div>

                  {/* Tombol ke Checkout */}
                  <Link href={`/checkout/${event.event_id}`}>
                    <Button className="w-full font-bold bg-[#6366F1] hover:bg-[#4F46E5] text-white">
                      Beli Tiket Sekarang
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}