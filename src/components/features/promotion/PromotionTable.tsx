"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { Promotion } from "@/types";
import { formatDate, formatIDR } from "@/lib/format";

interface PromotionTableProps {
  promotions: Promotion[];
  showActions: boolean;
  onEdit?: (promo: Promotion) => void;
  onDelete?: (promo: Promotion) => void;
}

export const PromotionTable = ({ promotions, showActions, onEdit, onDelete }: PromotionTableProps) => {
  if (promotions.length === 0) {
    return (
      <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-12 text-center">
        <p className="text-zinc-400">Tidak ada promo yang cocok dengan filter.</p>
      </div>
    );
  }

  return (
    <Table>
      <THead>
        <TR>
          <TH>Kode Promo</TH>
          <TH>Tipe</TH>
          <TH>Nilai Diskon</TH>
          <TH>Mulai</TH>
          <TH>Berakhir</TH>
          <TH>Penggunaan</TH>
          {showActions && <TH className="text-right">Action</TH>}
        </TR>
      </THead>
      <TBody>
        {promotions.map((p) => (
          <TR key={p.id}>
            <TD className="font-mono font-semibold text-[#F4F4F5]">{p.code}</TD>
            <TD>
              {p.type === "PERCENTAGE" ? (
                <Badge variant="secondary">Persentase</Badge>
              ) : (
                <Badge variant="warning">Nominal</Badge>
              )}
            </TD>
            <TD className="font-medium">
              {p.type === "PERCENTAGE" ? `${p.value}%` : formatIDR(p.value)}
            </TD>
            <TD className="text-zinc-300">{formatDate(p.startDate)}</TD>
            <TD className="text-zinc-300">{formatDate(p.endDate)}</TD>
            <TD className="text-zinc-300">
              {p.usageCount} / {p.usageLimit}
            </TD>
            {showActions && (
              <TD className="text-right">
                <div className="inline-flex gap-1">
                  <button
                    onClick={() => onEdit?.(p)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-[#6366F1] hover:bg-white/5 transition-colors"
                    aria-label={`Edit ${p.code}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete?.(p)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-[#EF4444] hover:bg-white/5 transition-colors"
                    aria-label={`Hapus ${p.code}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TD>
            )}
          </TR>
        ))}
      </TBody>
    </Table>
  );
};
