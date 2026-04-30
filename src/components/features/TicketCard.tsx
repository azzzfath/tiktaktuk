import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Ticket, QrCode, Download, Share2, Edit, Trash2 } from "lucide-react";

export interface TicketData {
  id: string;
  code: string;
  eventName: string;
  category: string;
  status: 'VALID' | 'TERPAKAI' | 'KADALUWARSA' | 'BATAL';
  date: string;
  venue: string;
  seat?: string;
  price: number;
  orderId: string;
  customerName: string;
}

interface TicketCardProps {
  ticket: TicketData;
  userRole: 'CUSTOMER' | 'ADMIN' | 'ORGANIZER';
  onEdit?: (ticket: TicketData) => void;
  onDelete?: (ticketId: string) => void;
  className?: string;
}

export function TicketCard({ ticket, userRole, onEdit, onDelete, className }: TicketCardProps) {
  const isAdminOrOrganizer = userRole === 'ADMIN' || userRole === 'ORGANIZER';

  const DetailItem = ({ label, value }: { label: string, value?: string }) => (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">
        {label}
      </span>
      <span className="text-sm font-medium text-white">
        {value || "-"}
      </span>
    </div>
  );

  return (
    <div className={cn("bg-surface-dark border border-white/10 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-stretch", className)}>
      {/* LEFT: DETAILS */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* HEADER */}
        <div className="flex items-start gap-4">
          <div className="bg-primary w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
            <Ticket className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge 
                variant={ticket.status === 'VALID' ? 'success' : ticket.status === 'TERPAKAI' ? 'warning' : ticket.status === 'BATAL' ? 'error' : 'default'}
                className="uppercase text-[10px] px-2 py-0"
              >
                {ticket.status}
              </Badge>
              <Badge variant="primary" className="uppercase text-[10px] px-2 py-0 bg-primary/10 text-primary">
                {ticket.category}
              </Badge>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">{ticket.eventName}</h3>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">{ticket.code}</p>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-4">
          <DetailItem label="Jadwal" value={ticket.date} />
          <DetailItem label="Lokasi" value={ticket.venue} />
          <DetailItem label="Kursi" value={ticket.seat} />
          <DetailItem label="Harga" value={`Rp ${ticket.price.toLocaleString('id-ID')}`} />
          <DetailItem label="Order" value={ticket.orderId} />
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider">Pelanggan</span>
            <span className={cn("text-sm font-medium text-white", isAdminOrOrganizer && "text-primary")}>
              {ticket.customerName}
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-3 mt-auto pt-2">
          {!isAdminOrOrganizer ? (
            <>
              <Button variant="primary" className="bg-[#1A1A1A] border border-white/20 hover:bg-white/10 text-white flex items-center gap-2 px-4 py-2">
                <QrCode className="w-4 h-4" />
                <span className="text-sm">Tampilkan QR</span>
              </Button>
              <Button variant="ghost" className="w-10 h-10 p-0 flex items-center justify-center rounded-lg border border-transparent hover:bg-white/5">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" className="w-10 h-10 p-0 flex items-center justify-center rounded-lg border border-transparent hover:bg-white/5">
                <Share2 className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" className="flex items-center gap-2 text-sm px-4 py-2" onClick={() => onEdit?.(ticket)}>
                <Edit className="w-4 h-4" />
                Update
              </Button>
              <Button variant="ghost" className="flex items-center gap-2 text-sm px-4 py-2 text-error hover:text-red-500 hover:bg-error/10" onClick={() => onDelete?.(ticket.id)}>
                <Trash2 className="w-4 h-4" />
                Hapus
              </Button>
            </>
          )}
        </div>

      </div>

      {/* RIGHT: QR CODE */}
      <div className="md:w-48 bg-[#FAFAFA] rounded-xl flex flex-col items-center justify-center p-6 gap-3 shrink-0">
         <div className="w-24 h-24 bg-black rounded-lg flex items-center justify-center text-white">
           <QrCode className="w-16 h-16" />
         </div>
         <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
           Scan Entry
         </p>
      </div>

    </div>
  );
}
