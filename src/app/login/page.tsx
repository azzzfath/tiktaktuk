import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/features/auth/AuthShell";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { getSessionUser, sessionCookieName } from "@/lib/db";

export default async function LoginPage() {
  const user = await getSessionUser((await cookies()).get(sessionCookieName)?.value);

  if (user) {
    redirect("/dashboard");
  }

  return (
    <AuthShell title="Masuk ke TikTakTuk" subtitle="Gunakan akun Anda untuk mengakses dashboard.">
      <LoginForm />
    </AuthShell>
  );
}
