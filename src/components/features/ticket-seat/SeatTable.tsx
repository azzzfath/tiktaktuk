"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { SeatRecord } from "@/types/ticket-seat";

interface SeatTableProps {
  seats: SeatRecord[];
  canManage: boolean;
  onEdit: (seat: SeatRecord) => void;
  onDelete: (seat: SeatRecord) => void;
}

export function SeatTable({ seats, canManage, onEdit, onDelete }: SeatTableProps) {
  return (
    <Table>
      <THead>
        <TR>
          <TH>Section</TH>
          <TH>Baris</TH>
          <TH>No. Kursi</TH>
          <TH>Venue</TH>
          <TH>Status</TH>
          {canManage && <TH>Aksi</TH>}
        </TR>
      </THead>
      <TBody>
        {seats.map((seat) => (
          <TR key={seat.seat_id}>
            <TD className="font-semibold">{seat.section}</TD>
            <TD>{seat.row_number}</TD>
            <TD>{seat.seat_number}</TD>
            <TD>{seat.venue_name}</TD>
            <TD>
              <Badge variant={seat.is_occupied ? "warning" : "success"}>
                {seat.is_occupied ? "TERISI" : "TERSEDIA"}
              </Badge>
            </TD>
            {canManage && (
              <TD>
                <div className="flex gap-2">
                  <Button variant="ghost" className="px-2 py-2" onClick={() => onEdit(seat)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="danger" className="px-2 py-2" disabled={seat.is_occupied} onClick={() => onDelete(seat)}>
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
