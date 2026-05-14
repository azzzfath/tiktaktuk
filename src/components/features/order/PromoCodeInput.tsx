"use client";

import { FormEvent, useState } from "react";
import { Tag, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { validPromoCodes, mockPromotions } from "@/lib/mock-data";
import { Promotion } from "@/types";

interface PromoCodeInputProps {
  applied: Promotion | null;
  onApply: (promo: Promotion | null) => void;
}

export const PromoCodeInput = ({ applied, onApply }: PromoCodeInputProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;
    if (!validPromoCodes.includes(normalized)) {
      setError("Kode promo tidak valid");
      onApply(null);
      return;
    }
    const promo = mockPromotions.find((p) => p.code === normalized) ?? null;
    setError(null);
    onApply(promo);
  };

  const clear = () => {
    setCode("");
    setError(null);
    onApply(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-semibold text-[#F4F4F5]">Kode Promo (Opsional)</h3>
      {applied ? (
        <div className="flex items-center justify-between gap-3 bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-lg px-3 py-2.5">
          <div className="inline-flex items-center gap-2">
            <Tag className="h-4 w-4 text-[#22C55E]" />
            <span className="text-sm font-medium text-[#F4F4F5]">{applied.code}</span>
            <span className="text-xs text-zinc-400">diterapkan</span>
          </div>
          <button
            type="button"
            onClick={clear}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="Hapus kode promo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input
              placeholder="Masukkan kode promo"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(null);
              }}
            />
            <Button type="submit" variant="secondary">
              Terapkan
            </Button>
          </div>
          {error && <p className="text-xs text-[#EF4444]">{error}</p>}
        </form>
      )}
    </div>
  );
};
