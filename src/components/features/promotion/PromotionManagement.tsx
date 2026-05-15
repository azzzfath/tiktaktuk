"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { mockPromotions } from "@/lib/mock-data";
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

  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Promotion | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Promotion | null>(null);

  const filtered = useMemo(() => {
    return promotions
      .filter((p) => p.code.toLowerCase().includes(search.trim().toLowerCase()))
      .filter((p) => (typeFilter === "ALL" ? true : p.type === typeFilter));
  }, [promotions, search, typeFilter]);

  const existingCodes = promotions.map((p) => p.code);

  const handleCreate = (values: PromotionFormValues) => {
    const newPromo: Promotion = {
      id: `promo_${Date.now()}`,
      code: values.code,
      type: values.type,
      value: values.value,
      startDate: values.startDate,
      endDate: values.endDate,
      usageLimit: values.usageLimit,
      usageCount: 0,
    };
    setPromotions((prev) => [newPromo, ...prev]);
    setCreateOpen(false);
  };

  const handleEdit = (id: string, values: PromotionFormValues) => {
    setPromotions((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              code: values.code,
              type: values.type,
              value: values.value,
              startDate: values.startDate,
              endDate: values.endDate,
              usageLimit: values.usageLimit,
            }
          : p
      )
    );
    setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    setDeleteTarget(null);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Manajemen Promosi</h1>
            <p className="text-sm text-zinc-400">Kelola kode promo dan kampanye diskon</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
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

        <PromotionTable
          promotions={filtered}
          showActions={isAdmin}
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
        />
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
