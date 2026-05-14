import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/features/auth/AuthShell";
import { RegisterForm } from "@/components/features/auth/RegisterForm";
import { RolePicker } from "@/components/features/auth/RolePicker";
import { getSessionUser, sessionCookieName } from "@/lib/db";
import { UserRole } from "@/types/auth";

interface RegisterPageProps {
  searchParams: {
    role?: UserRole;
  };
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const user = await getSessionUser(cookies().get(sessionCookieName)?.value);

  if (user) {
    redirect("/dashboard");
  }

  const role = searchParams.role;

  return (
    <AuthShell
      title={role ? `Daftar sebagai ${getRoleLabel(role)}` : "Pilih Jenis Akun"}
      subtitle="Buat akun baru untuk mulai menggunakan TikTakTuk."
    >
      {role ? <RegisterForm role={role} /> : <RolePicker />}
      <p className="mt-6 text-center text-sm text-zinc-400">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-medium text-[#6366F1]">
          Login di sini
        </Link>
      </p>
    </AuthShell>
  );
}

function getRoleLabel(role: UserRole) {
  const labels: Record<UserRole, string> = {
    administrator: "Administrator",
    organizer: "Penyelenggara",
    customer: "Pelanggan",
  };

  return labels[role] ?? "Pengguna";
}
