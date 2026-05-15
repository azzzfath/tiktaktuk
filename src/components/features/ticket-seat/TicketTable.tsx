"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { TicketRecord } from "@/types/ticket-seat";

interface TicketTableProps {
  tickets: TicketRecord[];
  canManage: boolean;
  onEdit: (ticket: TicketRecord) => void;
  onDelete: (ticket: TicketRecord) => void;
}

export function TicketTable({ tickets, canManage, onEdit, onDelete }: TicketTableProps) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Kode</TH>
          <TH>Event</TH>
          <TH>Pelanggan</TH>
          <TH>Kategori</TH>
          <TH>Kursi</TH>
          <TH>Status</TH>
          {canManage && <TH>Aksi</TH>}
        </TR>
      </THead>
      <TBody>
        {tickets.map((ticket) => (
          <TR key={ticket.ticket_id}>
            <TD className="font-semibold">{ticket.ticket_code}</TD>
            <TD>
              <div className="flex flex-col gap-1">
                <span>{ticket.event_title}</span>
                <span className="text-xs text-zinc-500">{new Date(ticket.event_datetime).toLocaleString("id-ID")}</span>
              </div>
            </TD>
            <TD>{ticket.customer_name}</TD>
            <TD>{ticket.category_name}</TD>
            <TD>{ticket.seat_label ?? "Tanpa kursi"}</TD>
            <TD>
              <Badge variant={ticket.status === "VALID" ? "success" : "warning"}>{ticket.status}</Badge>
            </TD>
            {canManage && (
              <TD>
                <div className="flex gap-2">
                  <Button variant="ghost" className="px-2 py-2" onClick={() => onEdit(ticket)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="danger" className="px-2 py-2" onClick={() => onDelete(ticket)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TD>
            )}
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
