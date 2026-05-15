"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TicketListPage } from "@/components/features/TicketListPage";
import { CreateTicketModal } from "@/components/features/CreateTicketModal";

export default function TicketsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState<'CUSTOMER' | 'ADMIN'>('ADMIN');

  return (
    <div className="min-h-screen bg-[#0F0F0F] p-6 sm:p-10 pb-28">

      {/* TOP NAV */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-10">
        <Link href="/" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        {/* Role Toggler */}
        <div className="flex items-center gap-3 bg-[#1A1A1A] border border-white/10 px-4 py-2 rounded-xl">
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Role:</span>
          <div className="flex bg-[#0F0F0F] rounded-lg p-1 border border-white/10">
            {(['CUSTOMER', 'ADMIN'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${role === r ? 'bg-[#6366F1] text-white' : 'text-zinc-500 hover:text-white'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <TicketListPage
        userRole={role}
        onOpenCreateTicket={() => setIsModalOpen(true)}
      />

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
