"use client";

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

// Mock Data disesuaikan dengan Gambar 8.1 (Skenario Publik)
const mockPublicEvents: (Event & { icon: React.ReactNode })[] = [
  {
    event_id: "1",
    event_title: "Konser Melodi Senja",
    event_date: "2024-05-15",
    event_time: "19:00",
    venue_id: "Jakarta Convention Center, Jakarta",
    artists: ["Fourtwnty", "Hindia"],
    categories: [
      { name: "WVIP", price: 1500000, quota: 50 },
      { name: "VIP", price: 750000, quota: 150 },
      { name: "Category 1", price: 450000, quota: 300 },
      { name: "Category 2", price: 250000, quota: 500 },
    ],
    description: "",
    icon: <Music className="w-16 h-16 text-white/50" />
  },
  {
    event_id: "2",
    event_title: "Festival Seni Budaya",
    event_date: "2024-05-22",
    event_time: "10:00",
    venue_id: "Taman Impian Jayakarta, Jakarta Utara",
    artists: ["Tulus"],
    categories: [
      { name: "General Admission", price: 150000, quota: 1000 },
    ],
    description: "",
    icon: <Palette className="w-16 h-16 text-white/50" />
  },
  {
    event_id: "3",
    event_title: "Malam Akustik Bandung",
    event_date: "2024-06-10",
    event_time: "18:00",
    venue_id: "Bandung Hall Center, Bandung",
    artists: ["Pamungkas", "Nadin Amizah"],
    categories: [
      { name: "WVIP", price: 800000, quota: 50 },
      { name: "VIP", price: 500000, quota: 100 },
      { name: "Regular", price: 350000, quota: 400 },
    ],
    description: "",
    icon: <Guitar className="w-16 h-16 text-white/50" />
  }
];

export default function ExplorePage() {
  // Fungsi untuk mendapatkan harga termurah dari kategori tiket
  const getStartingPrice = (categories: Event['categories']) => {
    if (!categories || categories.length === 0) return 0;
    return Math.min(...categories.map(c => c.price));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#F4F4F5]">Jelajahi Acara</h1>
        <p className="text-[#71717A] mt-2">Temukan acara terbaik dan beli tiket favorit Anda</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
          <Input className="pl-10 bg-[#1A1A1A]" placeholder="Cari acara atau artis..." />
        </div>
        <Button variant="ghost" className="border border-white/10 bg-[#1A1A1A] text-[#71717A] flex justify-between items-center gap-4 min-w-[160px]">
          Semua Venue <ChevronDown className="w-4 h-4" />
        </Button>
        <Button variant="ghost" className="border border-white/10 bg-[#1A1A1A] text-[#71717A] flex justify-between items-center gap-4 min-w-[160px]">
          Semua Artis <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Grid Acara */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPublicEvents.map((event) => {
          const startingPrice = getStartingPrice(event.categories);

          return (
            <Card key={event.event_id} className="p-0 overflow-hidden flex flex-col border border-white/10 bg-[#1A1A1A]">
              {/* Image Banner Placeholder */}
              <div className="h-48 bg-[#4F46E5] relative flex justify-center items-center">
                <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full p-2 transition-colors">
                  <Heart className="w-5 h-5 text-white" />
                </button>
                {event.icon}
              </div>
              
              {/* Card Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-[#F4F4F5] mb-2">{event.event_title}</h3>
                
                {/* Artist Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {event.artists.map(artist => (
                    <Badge key={artist} variant="muted" className="text-[10px] bg-white/5 text-[#A1A1AA] border border-white/10">
                      {artist}
                    </Badge>
                  ))}
                </div>

                {/* Info Date & Venue */}
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-[#A1A1AA] text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{event.event_date} - {event.event_time}</span>
                  </div>
                  <div className="flex items-start gap-2 text-[#A1A1AA] text-xs">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{event.venue_id}</span>
                  </div>
                </div>

                {/* Starting Price */}
                <div className="text-[#6366F1] font-bold text-sm mb-3">
                  $ Mulai Rp {startingPrice.toLocaleString('id-ID')}
                </div>

                {/* Ticket Categories */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {event.categories.map(cat => (
                    <Badge key={cat.name} variant="primary" className="text-[10px] bg-white/5 text-[#6366F1] border border-[#6366F1]/30">
                      {cat.name}
                    </Badge>
                  ))}
                </div>

                {/* Action Button */}
                <Button variant="primary" className="w-full mt-auto font-semibold">
                  Beli Tiket
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
}