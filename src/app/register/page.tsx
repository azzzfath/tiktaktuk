"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useRole } from "@/hooks/useRole";
import type { AccountRole } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useRole();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AccountRole>("customer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register({ username, password, fullName, email, role });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Register gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <div className="max-w-md mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-[#6366F1] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>

        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-[#1A1A1A] rounded-xl border border-white/10 p-6 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#6366F1]/20 text-[#6366F1]">
              <UserPlus className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold">Register</h1>
            <p className="text-sm text-zinc-400">Buat akun customer, organizer, atau admin.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300">Username</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300">Nama Lengkap</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300">Role</label>
            <Select value={role} onChange={(e) => setRole(e.target.value as AccountRole)}>
              <option value="customer" className="bg-[#1A1A1A]">Customer</option>
              <option value="organizer" className="bg-[#1A1A1A]">Organizer</option>
              <option value="admin" className="bg-[#1A1A1A]">Admin</option>
            </Select>
          </div>

          {error && <p className="text-sm text-[#EF4444]">{error}</p>}

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Memproses..." : "Register"}
          </Button>

          <p className="text-sm text-zinc-400">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-[#6366F1] hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
