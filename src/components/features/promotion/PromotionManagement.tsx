"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { DiscountType, Promotion } from "@/types";
import { UserRole } from "@/types/auth";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { PromotionStatsCards } from "@/components/features/promotion/PromotionStatsCards";
import { PromotionTable } from "@/components/features/promotion/PromotionTable";
import { CreatePromotionModal } from "@/components/features/promotion/CreatePromotionModal";
import { EditPromotionModal } from "@/components/features/promotion/EditPromotionModal";
import { DeletePromotionModal } from "@/components/features/promotion/DeletePromotionModal";
import { PromotionFormValues } from "@/components/features/promotion/PromotionForm";

type TypeFilter = "ALL" | DiscountType;

interface PromotionManagementProps {
  role: UserRole;
}

export function PromotionManagement({ role }: PromotionManagementProps) {
  const isAdmin = role === "administrator";
  const { toast } = useToast();

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
        const response = await fetch("/api/promotions");
        if (!response.ok) throw new Error(await readError(response));
        const data = (await response.json()) as Promotion[];
        if (active) setPromotions(data);
      } catch (error) {
        if (active) toast(error instanceof Error ? error.message : "Gagal memuat promo.", "error");
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
      .filter((promo) => promo.code.toLowerCase().includes(search.trim().toLowerCase()))
      .filter((promo) => (typeFilter === "ALL" ? true : promo.type === typeFilter));
  }, [promotions, search, typeFilter]);

  const existingCodes = promotions.map((promo) => promo.code);

  const handleCreate = async (values: PromotionFormValues) => {
    try {
      const response = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(await readError(response));
      const promotion = (await response.json()) as Promotion;
      setPromotions((prev) => [promotion, ...prev]);
      setCreateOpen(false);
      toast(`Promo ${promotion.code} berhasil dibuat.`, "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Gagal membuat promo.", "error");
    }
  };

  const handleEdit = async (id: string, values: PromotionFormValues) => {
    try {
      const response = await fetch(`/api/promotions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(await readError(response));
      const promotion = (await response.json()) as Promotion;
      setPromotions((prev) => prev.map((item) => (item.id === id ? promotion : item)));
      setEditTarget(null);
      toast(`Promo ${promotion.code} berhasil diperbarui.`, "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Gagal memperbarui promo.", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/promotions/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(await readError(response));
      setPromotions((prev) => prev.filter((promo) => promo.id !== id));
      setDeleteTarget(null);
      toast("Promo berhasil dihapus.", "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Gagal menghapus promo.", "error");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Manajemen Promosi</h1>
            <p className="text-sm text-zinc-400">Kelola kode promo dan kampanye diskon</p>
          </div>
          {isAdmin && (
            <Button variant="primary" onClick={() => setCreateOpen(true)}>
              <span className="inline-flex items-center gap-1.5">
                <Plus className="h-4 w-4" /> Buat Promo
              </span>
            </Button>
          )}
        </div>

        <PromotionStatsCards promotions={promotions} />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Cari kode promo..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9"
            />
          </div>
          <div className="sm:w-56">
            <Select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}>
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
    </section>
  );
}

async function readError(response: Response) {
  const payload = await response.json().catch(() => null) as { error?: string; message?: string } | null;
  return payload?.error ?? payload?.message ?? "Request gagal.";
}
