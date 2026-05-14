"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Search } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { useToast } from "@/hooks/useToast";
import {
  createPromotion as createPromotionRequest,
  deletePromotion as deletePromotionRequest,
  listPromotions,
  updatePromotion as updatePromotionRequest,
} from "@/lib/api";
import type { DiscountType, Promotion } from "@/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { RoleSwitcher } from "@/components/features/order/RoleSwitcher";
import { PromotionStatsCards } from "@/components/features/promotion/PromotionStatsCards";
import { PromotionTable } from "@/components/features/promotion/PromotionTable";
import { CreatePromotionModal } from "@/components/features/promotion/CreatePromotionModal";
import { EditPromotionModal } from "@/components/features/promotion/EditPromotionModal";
import { DeletePromotionModal } from "@/components/features/promotion/DeletePromotionModal";
import { PromotionFormValues } from "@/components/features/promotion/PromotionForm";

type TypeFilter = "ALL" | DiscountType;

export default function PromotionsPage() {
  const { role } = useRole();
  const { toast } = useToast();
  const isAdmin = role === "admin";

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Promotion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Promotion | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPromotions() {
      try {
        const data = await listPromotions();
        if (active) setPromotions(data);
      } catch (error) {
        if (active) {
          toast(error instanceof Error ? error.message : "Gagal memuat promo", "error");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadPromotions();
    return () => {
      active = false;
    };
  }, [toast]);

  const filtered = useMemo(() => {
    return promotions
      .filter((p) => p.code.toLowerCase().includes(search.trim().toLowerCase()))
      .filter((p) => (typeFilter === "ALL" ? true : p.type === typeFilter));
  }, [promotions, search, typeFilter]);

  const existingCodes = promotions.map((p) => p.code);

  const handleCreate = async (values: PromotionFormValues) => {
    try {
      const newPromo = await createPromotionRequest(values);
      setPromotions((prev) => [newPromo, ...prev]);
      setCreateOpen(false);
      toast(`Promo ${newPromo.code} berhasil dibuat.`, "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Gagal membuat promo", "error");
    }
  };

  const handleEdit = async (id: string, values: PromotionFormValues) => {
    try {
      const updatedPromo = await updatePromotionRequest(id, values);
      setPromotions((prev) => prev.map((p) => (p.id === id ? updatedPromo : p)));
      setEditTarget(null);
      toast(`Promo ${updatedPromo.code} berhasil diperbarui.`, "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Gagal memperbarui promo", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const deletedPromo = await deletePromotionRequest(id);
      setPromotions((prev) => prev.filter((p) => p.id !== id));
      setDeleteTarget(null);
      toast(`Promo ${deletedPromo.code} berhasil dihapus.`, "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Gagal menghapus promo", "error");
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
              <h1 className="text-3xl font-bold">Manajemen Promosi</h1>
              <p className="text-sm text-zinc-400">Kelola kode promo dan kampanye diskon</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <RoleSwitcher />
              {isAdmin && (
                <Button variant="primary" onClick={() => setCreateOpen(true)}>
                  <span className="inline-flex items-center gap-1.5">
                    <Plus className="h-4 w-4" /> Buat Promo
                  </span>
                </Button>
              )}
            </div>
          </div>

          <PromotionStatsCards promotions={promotions} />

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Cari kode promo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="sm:w-56">
              <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}>
                <option value="ALL" className="bg-[#1A1A1A]">Semua Tipe</option>
                <option value="PERCENTAGE" className="bg-[#1A1A1A]">Persentase</option>
                <option value="NOMINAL" className="bg-[#1A1A1A]">Nominal</option>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="bg-[#1A1A1A] rounded-xl border border-white/10 p-12 text-center">
              <p className="text-zinc-400">Memuat data promo...</p>
            </div>
          ) : (
            <PromotionTable
              promotions={filtered}
              showActions={isAdmin}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          )}
        </div>
      </div>

      {isAdmin && (
        <>
          <CreatePromotionModal
            open={createOpen}
            existingCodes={existingCodes}
            onClose={() => setCreateOpen(false)}
            onSubmit={handleCreate}
          />
          <EditPromotionModal
            promotion={editTarget}
            existingCodes={existingCodes}
            onClose={() => setEditTarget(null)}
            onSubmit={handleEdit}
          />
          <DeletePromotionModal
            promotion={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        </>
      )}
    </main>
  );
}
