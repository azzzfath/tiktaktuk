import Link from "next/link";
import { Ticket, Armchair, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center p-8">

      {/* PAGE TITLE */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-[#F4F4F5] tracking-tight">Development Dashboard</h1>
        <p className="text-[#71717A] text-sm mt-2">Pilih modul untuk mulai bekerja</p>
      </div>

      <div className="flex flex-col gap-8 w-full max-w-3xl">

        {/* ========================================== */}
        {/* TOP CONTAINER: TICKET MODULE -> /tickets   */}
        {/* ========================================== */}
        <Link href="/tickets" className="group block rounded-2xl border border-white/10 bg-[#1A1A1A] p-8 hover:border-[#6366F1]/50 hover:bg-[#1A1A1A]/80 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] transition-all duration-300 cursor-pointer">
          
          {/* Header Label */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#6366F1]/10 flex items-center justify-center">
                <Ticket className="w-5 h-5 text-[#6366F1]" />
              </div>
              <p className="text-sm font-semibold text-[#71717A] uppercase tracking-widest">
                Fitur : Manajemen Tiket (Nomor 18, 19, 20)
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-[#6366F1] group-hover:translate-x-1 transition-all duration-300" />
          </div>

          {/* 3-Column Inner Cards (NON-CLICKABLE, visual only) */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { number: "18", label: "C", sub: "Tiket", desc: "Create" },
              { number: "19", label: "R", sub: "Tiket", desc: "Read" },
              { number: "20", label: "UD", sub: "Tiket", desc: "Update & Delete" },
            ].map((item) => (
              <div
                key={item.number}
                className="bg-[#0F0F0F] border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-2 min-h-[120px] pointer-events-none select-none"
              >
                <span className="text-2xl font-black text-[#6366F1] leading-none">{item.label}</span>
                <span className="text-[#F4F4F5] font-semibold text-sm">{item.sub}</span>
                <span className="text-[#71717A] text-xs text-center">{item.number}. {item.desc}</span>
              </div>
            ))}
          </div>

        </Link>

        {/* ========================================= */}
        {/* BOTTOM CONTAINER: SEAT MODULE -> /seats   */}
        {/* ========================================= */}
        <Link href="/seats" className="group block rounded-2xl border border-white/10 bg-[#1A1A1A] p-8 hover:border-[#06B6D4]/50 hover:bg-[#1A1A1A]/80 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)] transition-all duration-300 cursor-pointer">

          {/* 2-Column Inner Cards (NON-CLICKABLE, visual only) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { number: "21", label: "CUD", sub: "Seat", desc: "Create, Update & Delete" },
              { number: "22", label: "R", sub: "Seat", desc: "Read" },
            ].map((item) => (
              <div
                key={item.number}
                className="bg-[#0F0F0F] border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center gap-2 min-h-[120px] pointer-events-none select-none"
              >
                <span className="text-2xl font-black text-[#06B6D4] leading-none">{item.label}</span>
                <span className="text-[#F4F4F5] font-semibold text-sm">{item.sub}</span>
                <span className="text-[#71717A] text-xs text-center">{item.number}. {item.desc}</span>
              </div>
            ))}
          </div>

          {/* Footer Label */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#06B6D4]/10 flex items-center justify-center">
                <Armchair className="w-5 h-5 text-[#06B6D4]" />
              </div>
              <p className="text-sm font-semibold text-[#71717A] uppercase tracking-widest">
                Fitur : Manajemen Kursi (Nomor 21, 22)
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-[#06B6D4] group-hover:translate-x-1 transition-all duration-300" />
          </div>

        </Link>

      </div>
    </main>
  );
}
