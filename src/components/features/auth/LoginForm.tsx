"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/hooks/useToast";

interface LoginFormState {
  username: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<LoginFormState>({ username: "", password: "" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast(result.message ?? "Login gagal.", "error");
      return;
    }

    toast("Login berhasil.");
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2 text-sm font-medium">
        Username
        <Input
          value={form.username}
          placeholder="Masukkan username"
          onChange={(event) => setForm({ ...form, username: event.target.value })}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium">
        Password
        <Input
          type="password"
          value={form.password}
          placeholder="Masukkan password"
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
      </label>
      <Button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2">
        <LogIn className="h-4 w-4" />
        {loading ? "Memproses..." : "Masuk"}
      </Button>
      <Link
        href="/register"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#6366F1] bg-transparent px-4 py-2 text-sm font-medium text-[#6366F1] transition-colors hover:bg-[#6366F1]/10"
      >
        <UserPlus className="h-4 w-4" />
        Buat Akun Baru
      </Link>
    </form>
  );
}
