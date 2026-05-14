"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { useToast } from "@/hooks/useToast";
import {
  deleteOrder as deleteOrderRequest,
  listOrders,
  updateOrderStatus,
} from "@/lib/api";
import type { Order, PaymentStatus } from "@/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { OrderStatsCards } from "@/components/features/order/OrderStatsCards";
import { OrderTable } from "@/components/features/order/OrderTable";
import { UpdateOrderModal } from "@/components/features/order/UpdateOrderModal";
import { DeleteOrderModal } from "@/components/features/order/DeleteOrderModal";
import { RoleSwitcher } from "@/components/features/order/RoleSwitcher";

type StatusFilter = "ALL" | PaymentStatus;

export default function OrdersPage() {
  const { role } = useRole();
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
        const data = await listOrders();
        if (active) setOrders(data);
      } catch (error) {
        if (active) {
          toast(error instanceof Error ? error.message : "Gagal memuat order", "error");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadOrders();
    return () => {
      active = false;
    };
  }, [role, toast]);

  const filtered = useMemo(() => {
    return orders
      .filter((o) => o.id.toLowerCase().includes(search.trim().toLowerCase()))
      .filter((o) => (statusFilter === "ALL" ? true : o.status === statusFilter))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, search, statusFilter]);

  const handleUpdate = async (id: string, status: PaymentStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? updatedOrder : o)));
      setUpdateTarget(null);
      toast(`Status order ${id} berhasil diperbarui.`, "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Gagal memperbarui order", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOrderRequest(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setDeleteTarget(null);
      toast(`Order ${id} berhasil dihapus.`, "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Gagal menghapus order", "error");
    }
  };

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-[#6366F1] transition-colors w-fit"
              >
                <ArrowLeft className="h-4 w-4" /> Kembali
              </Link>
              <h1 className="text-3xl font-bold">Daftar Order</h1>
              <p className="text-sm text-zinc-400">Riwayat pembelian tiket Anda</p>
            </div>
            <RoleSwitcher />
          </div>

          <OrderStatsCards orders={orders} role={role} />

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

          {loading ? (
            <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-12 text-center">
              <p className="text-zinc-400">Memuat data order...</p>
            </div>
          ) : (
            <OrderTable
              orders={filtered}
              role={role}
              onUpdate={setUpdateTarget}
              onDelete={setDeleteTarget}
            />
          )}
        </div>
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
    </main>
  );
}
