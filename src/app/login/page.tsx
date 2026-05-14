"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRole } from "@/hooks/useRole";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useRole();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ username, password });
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
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
              <LogIn className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-bold">Login</h1>
            <p className="text-sm text-zinc-400">Masuk untuk mengakses fitur TK04.</p>
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

          {error && <p className="text-sm text-[#EF4444]">{error}</p>}

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Memproses..." : "Login"}
          </Button>

          <p className="text-sm text-zinc-400">
            Belum punya akun?{" "}
            <Link href="/register" className="text-[#6366F1] hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
