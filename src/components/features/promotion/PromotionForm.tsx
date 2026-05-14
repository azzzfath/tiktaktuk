"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { DiscountType, Promotion } from "@/types";

export interface PromotionFormValues {
  code: string;
  type: DiscountType;
  value: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
}

interface PromotionFormProps {
  initialValues?: Partial<PromotionFormValues>;
  existingCodes?: string[];
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (values: PromotionFormValues) => void;
}

const blank: PromotionFormValues = {
  code: "",
  type: "PERCENTAGE",
  value: 0,
  startDate: "",
  endDate: "",
  usageLimit: 0,
};

export const PromotionForm = ({
  initialValues,
  existingCodes = [],
  submitLabel,
  onCancel,
  onSubmit,
}: PromotionFormProps) => {
  const [values, setValues] = useState<PromotionFormValues>({ ...blank, ...initialValues });
  const [errors, setErrors] = useState<Partial<Record<keyof PromotionFormValues, string>>>({});

  const update = <K extends keyof PromotionFormValues>(key: K, val: PromotionFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(values, existingCodes, initialValues?.code);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({ ...values, code: values.code.trim().toUpperCase() });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Kode Promo" error={errors.code}>
        <Input
          placeholder="CTH: TIKTAK20"
          value={values.code}
          onChange={(e) => update("code", e.target.value)}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tipe Diskon" error={errors.type}>
          <Select value={values.type} onChange={(e) => update("type", e.target.value as DiscountType)}>
            <option value="PERCENTAGE" className="bg-[#1A1A1A]">Persentase</option>
            <option value="NOMINAL" className="bg-[#1A1A1A]">Nominal</option>
          </Select>
        </Field>
        <Field label="Nilai Diskon" error={errors.value}>
          <Input
            type="number"
            min={1}
            placeholder="cth: 20"
            value={values.value || ""}
            onChange={(e) => update("value", Number(e.target.value))}
          />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tanggal Mulai" error={errors.startDate}>
          <Input type="date" value={values.startDate} onChange={(e) => update("startDate", e.target.value)} />
        </Field>
        <Field label="Tanggal Berakhir" error={errors.endDate}>
          <Input type="date" value={values.endDate} onChange={(e) => update("endDate", e.target.value)} />
        </Field>
      </div>
      <Field label="Batas Penggunaan" error={errors.usageLimit}>
        <Input
          type="number"
          min={1}
          placeholder="cth: 100"
          value={values.usageLimit || ""}
          onChange={(e) => update("usageLimit", Number(e.target.value))}
        />
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-medium text-zinc-300">{label}</label>
    {children}
    {error && <p className="text-xs text-[#EF4444]">{error}</p>}
  </div>
);

function validate(
  v: PromotionFormValues,
  existing: string[],
  currentCode?: string
): Partial<Record<keyof PromotionFormValues, string>> {
  const errs: Partial<Record<keyof PromotionFormValues, string>> = {};
  const code = v.code.trim().toUpperCase();
  if (!code) errs.code = "Kode promo wajib diisi.";
  else if (existing.includes(code) && code !== currentCode?.toUpperCase())
    errs.code = "Kode promo sudah digunakan.";
  if (!v.value || v.value <= 0) errs.value = "Nilai harus lebih dari 0.";
  if (!v.startDate) errs.startDate = "Tanggal mulai wajib diisi.";
  if (!v.endDate) errs.endDate = "Tanggal berakhir wajib diisi.";
  if (v.startDate && v.endDate && v.endDate < v.startDate)
    errs.endDate = "Tanggal berakhir harus >= tanggal mulai.";
  if (!v.usageLimit || v.usageLimit <= 0) errs.usageLimit = "Batas harus lebih dari 0.";
  return errs;
}

export type { Promotion };
