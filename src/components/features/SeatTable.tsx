import React from "react";
import { Edit, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Seat {
  id: string;
  section: string;
  row: string;
  seatNumber: string;
  venueName: string;
  status: 'TERSEDIA' | 'TERISI';
}

interface SeatTableProps {
  seats: Seat[];
  userRole: 'CUSTOMER' | 'ADMIN' | 'ORGANIZER';
  onEdit?: (seat: Seat) => void;
  onDelete?: (seat: Seat) => void;
}

export function SeatTable({ seats, userRole, onEdit, onDelete }: SeatTableProps) {
  const isAdminOrOrganizer = userRole === 'ADMIN' || userRole === 'ORGANIZER';

  return (
    <div className="bg-surface-dark border border-white/10 rounded-xl overflow-hidden overflow-x-auto w-full">
      <table className="w-full text-left text-sm text-zinc-400 whitespace-nowrap">
        <thead className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-zinc-500 font-semibold">
          <tr>
            <th className="px-6 py-4">Section</th>
            <th className="px-6 py-4">Baris</th>
            <th className="px-6 py-4">No. Kursi</th>
            <th className="px-6 py-4">Venue</th>
            <th className="px-6 py-4">Status</th>
            {isAdminOrOrganizer && <th className="px-6 py-4 text-right"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {seats.map((seat) => (
            <tr key={seat.id} className="hover:bg-white/5 transition-colors group">
              <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-8a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v8"/><path d="M15 11V7a3 3 0 0 0-6 0v4"/><path d="M4 21h16"/></svg>
                </div>
                {seat.section}
              </td>
              <td className="px-6 py-4 text-white">{seat.row}</td>
              <td className="px-6 py-4 text-white">{seat.seatNumber}</td>
              <td className="px-6 py-4 text-zinc-300 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                 {seat.venueName}
              </td>
              <td className="px-6 py-4">
                {seat.status === 'TERSEDIA' ? (
                  <div className="inline-flex items-center gap-1 bg-green-500/10 text-green-500 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Tersedia
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Terisi
                  </div>
                )}
              </td>
              {isAdminOrOrganizer && (
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit?.(seat)}
                      className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                      title="Edit Kursi"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete?.(seat)}
                      disabled={seat.status === 'TERISI'}
                      title={seat.status === 'TERISI' ? 'Kursi sudah terisi' : 'Hapus Kursi'}
                      className={cn(
                        "p-2 rounded-lg transition-colors flex items-center justify-center",
                        seat.status === 'TERISI' 
                          ? 'text-zinc-600 cursor-not-allowed opacity-50' 
                          : 'text-error hover:bg-error/10 hover:text-red-500'
                      )}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
          {seats.length === 0 && (
            <tr>
              <td colSpan={isAdminOrOrganizer ? 6 : 5} className="px-6 py-12 text-center text-zinc-500">
                Tidak ada data kursi yang ditemukan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
