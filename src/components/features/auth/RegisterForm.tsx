"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";
import { UserRole } from "@/types/auth";

interface RegisterFormProps {
  role: UserRole;
}

interface RegisterFormState {
  displayName: string;
  contact: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
}

const roleLabels: Record<UserRole, string> = {
  administrator: "Administrator",
  organizer: "Penyelenggara",
  customer: "Pelanggan",
};

export function RegisterForm({ role }: RegisterFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<RegisterFormState>({
    displayName: "",
    contact: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const showProfileFields = role !== "administrator";
  const contactLabel = role === "organizer" ? "Email Kontak" : "Nomor Telepon";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast("Konfirmasi password tidak sama.", "error");
      return;
    }

    if (!form.agreed) {
      toast("Setujui syarat dan ketentuan terlebih dahulu.", "error");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role,
        username: form.username,
        password: form.password,
        fullName: role === "customer" ? form.displayName : undefined,
        phoneNumber: role === "customer" ? form.contact : undefined,
        organizerName: role === "organizer" ? form.displayName : undefined,
        contactEmail: role === "organizer" ? form.contact : undefined,
      }),
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast(result.message ?? "Registrasi gagal.", "error");
      return;
    }

    toast("Akun berhasil dibuat. Silakan login.");
    router.push("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Link href="/register" className="inline-flex items-center gap-2 text-sm font-medium text-[#6366F1]">
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Link>
      {showProfileFields ? (
        <>
          <label className="flex flex-col gap-2 text-sm font-medium">
            {role === "organizer" ? "Nama Organizer" : "Nama Lengkap"}
            <Input
              value={form.displayName}
              placeholder="Masukkan nama"
              onChange={(event) => setForm({ ...form, displayName: event.target.value })}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium">
            {contactLabel}
            <Input
              value={form.contact}
              placeholder={`Masukkan ${contactLabel.toLowerCase()}`}
              onChange={(event) => setForm({ ...form, contact: event.target.value })}
            />
          </label>
        </>
      ) : null}
      <label className="flex flex-col gap-2 text-sm font-medium">
        Username
        <Input
          value={form.username}
          placeholder="Pilih username"
          onChange={(event) => setForm({ ...form, username: event.target.value })}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium">
        Password
        <Input
          type="password"
          value={form.password}
          placeholder="Minimal 6 karakter"
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium">
        Konfirmasi Password
        <Input
          type="password"
          value={form.confirmPassword}
          placeholder="Konfirmasi password"
          onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
        />
      </label>
      <label className="flex items-center gap-2 text-xs text-zinc-400">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-white/10 bg-[#1A1A1A]"
          checked={form.agreed}
          onChange={(event) => setForm({ ...form, agreed: event.target.checked })}
        />
        Saya setuju dengan Syarat & Ketentuan
      </label>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Mendaftar..." : `Daftar sebagai ${roleLabels[role]}`}
      </Button>
    </form>
  );
}
