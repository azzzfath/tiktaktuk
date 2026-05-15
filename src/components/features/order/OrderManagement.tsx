"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Order, PaymentStatus } from "@/types";
import { UserRole } from "@/types/auth";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { OrderStatsCards } from "@/components/features/order/OrderStatsCards";
import { OrderTable } from "@/components/features/order/OrderTable";
import { UpdateOrderModal } from "@/components/features/order/UpdateOrderModal";
import { DeleteOrderModal } from "@/components/features/order/DeleteOrderModal";

type StatusFilter = "ALL" | PaymentStatus;

function toLegacyRole(role: UserRole) {
  if (role === "administrator") return "admin" as const;
  return role as "customer" | "organizer";
}

interface OrderManagementProps {
  role: UserRole;
}

export function OrderManagement({ role }: OrderManagementProps) {
  const legacyRole = toLegacyRole(role);
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [loading, setLoading] = useState(true);
  const [updateTarget, setUpdateTarget] = useState<Order | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error(await readError(response));
        const data = (await response.json()) as Order[];
        if (active) setOrders(data);
      } catch (error) {
        if (active) toast(error instanceof Error ? error.message : "Gagal memuat order.", "error");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadOrders();
    return () => {
      active = false;
    };
  }, [toast]);

  const filtered = useMemo(() => {
    return orders
      .filter((order) => order.id.toLowerCase().includes(search.trim().toLowerCase()))
      .filter((order) => (statusFilter === "ALL" ? true : order.status === statusFilter))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, search, statusFilter]);

  const handleUpdate = async (id: string, status: PaymentStatus) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error(await readError(response));
      const updated = (await response.json()) as Order;
      setOrders((prev) => prev.map((order) => (order.id === id ? updated : order)));
      setUpdateTarget(null);
      toast(`Status order ${id} berhasil diperbarui.`, "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Gagal memperbarui order.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(await readError(response));
      setOrders((prev) => prev.filter((order) => order.id !== id));
      setDeleteTarget(null);
      toast(`Order ${id} berhasil dihapus.`, "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Gagal menghapus order.", "error");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Daftar Order</h1>
          <p className="text-sm text-zinc-400">Riwayat pembelian tiket Anda</p>
        </div>

        <OrderStatsCards orders={orders} role={legacyRole} />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Cari order ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
            />
          </div>
          <div className="sm:w-56">
            <Select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
            >
              <option value="ALL" className="bg-[#1A1A1A]">Semua Status</option>
              <option value="PAID" className="bg-[#1A1A1A]">Lunas</option>
              <option value="PENDING" className="bg-[#1A1A1A]">Pending</option>
              <option value="CANCELLED" className="bg-[#1A1A1A]">Dibatalkan</option>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-12 text-center">
            <p className="text-zinc-400">Memuat data order...</p>
          </div>
        ) : (
          <OrderTable
            orders={filtered}
            role={legacyRole}
            onUpdate={setUpdateTarget}
            onDelete={setDeleteTarget}
          />
        )}
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

async function readError(response: Response) {
  const payload = await response.json().catch(() => null) as { error?: string; message?: string } | null;
  return payload?.error ?? payload?.message ?? "Request gagal.";
}
