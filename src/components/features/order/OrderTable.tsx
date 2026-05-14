"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Order, Role } from "@/types";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { formatDate, formatIDR, initials } from "@/lib/format";

interface OrderTableProps {
  orders: Order[];
  role: Role;
  onUpdate?: (order: Order) => void;
  onDelete?: (order: Order) => void;
}

export const OrderTable = ({ orders, role, onUpdate, onDelete }: OrderTableProps) => {
  const showCustomer = role === "organizer" || role === "admin";
  const showActions = role === "admin";

  if (orders.length === 0) {
    return (
      <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-12 text-center">
        <p className="text-zinc-400">Tidak ada order yang cocok dengan filter.</p>
      </div>
    );
  }

  return (
    <Table>
      <THead>
        <TR>
          <TH>Order ID</TH>
          <TH>Tanggal</TH>
          {showCustomer && <TH>Pelanggan</TH>}
          <TH>Status</TH>
          <TH className="text-right">Total</TH>
          {showActions && <TH className="text-right">Action</TH>}
        </TR>
      </THead>
      <TBody>
        {orders.map((order) => (
          <TR key={order.id}>
            <TD className="font-mono text-sm">{order.id}</TD>
            <TD className="text-zinc-300">{formatDate(order.createdAt)}</TD>
            {showCustomer && (
              <TD>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#6366F1]/20 text-[#6366F1] text-xs font-semibold">
                    {initials(order.customer.name)}
                  </span>
                  <span className="text-sm text-[#F4F4F5]">{order.customer.name}</span>
                </div>
              </TD>
            )}
            <TD>
              <OrderStatusBadge status={order.status} />
            </TD>
            <TD className="text-right font-medium">{formatIDR(order.total)}</TD>
            {showActions && (
              <TD className="text-right">
                <div className="inline-flex gap-1">
                  <button
                    onClick={() => onUpdate?.(order)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-[#6366F1] hover:bg-white/5 transition-colors"
                    aria-label={`Update ${order.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete?.(order)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-[#EF4444] hover:bg-white/5 transition-colors"
                    aria-label={`Hapus ${order.id}`}
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
