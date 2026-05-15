"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { mockOrders } from "@/lib/mock-data";
import { Order, PaymentStatus } from "@/types";
import { UserRole } from "@/types/auth";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { OrderStatsCards } from "@/components/features/order/OrderStatsCards";
import { OrderTable } from "@/components/features/order/OrderTable";
import { UpdateOrderModal } from "@/components/features/order/UpdateOrderModal";
import { DeleteOrderModal } from "@/components/features/order/DeleteOrderModal";

type StatusFilter = "ALL" | PaymentStatus;

/** Map real SessionUser role to the legacy Role used by order sub-components */
function toLegacyRole(role: UserRole) {
  if (role === "administrator") return "admin" as const;
  return role as "customer" | "organizer";
}

interface OrderManagementProps {
  role: UserRole;
}

export function OrderManagement({ role }: OrderManagementProps) {
  const legacyRole = toLegacyRole(role);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [updateTarget, setUpdateTarget] = useState<Order | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    return orders
      .filter((o) => o.id.toLowerCase().includes(search.trim().toLowerCase()))
      .filter((o) => (statusFilter === "ALL" ? true : o.status === statusFilter))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, search, statusFilter]);

  const handleUpdate = (id: string, status: PaymentStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setUpdateTarget(null);
  };

  const handleDelete = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    setDeleteTarget(null);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Daftar Order</h1>
            <p className="text-sm text-zinc-400">Riwayat pembelian tiket Anda</p>
          </div>
        </div>

        <OrderStatsCards orders={orders} role={legacyRole} />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Cari order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="sm:w-56">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="ALL" className="bg-[#1A1A1A]">Semua Status</option>
              <option value="PAID" className="bg-[#1A1A1A]">Lunas</option>
              <option value="PENDING" className="bg-[#1A1A1A]">Pending</option>
              <option value="CANCELLED" className="bg-[#1A1A1A]">Dibatalkan</option>
            </Select>
          </div>
        </div>

        <OrderTable
          orders={filtered}
          role={legacyRole}
          onUpdate={setUpdateTarget}
          onDelete={setDeleteTarget}
        />
      </div>

      <UpdateOrderModal
        order={updateTarget}
        onClose={() => setUpdateTarget(null)}
        onSubmit={handleUpdate}
      />
      <DeleteOrderModal
        order={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </section>
  );
}
