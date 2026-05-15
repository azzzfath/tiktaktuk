import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { getSessionUser, sessionCookieName } from "@/lib/db";
import { AppNavbar } from "@/components/features/layout/AppNavbar";

interface ProtectedShellProps {
  children: ReactNode;
}

export async function ProtectedShell({ children }: ProtectedShellProps) {
  const user = await getSessionUser((await cookies()).get(sessionCookieName)?.value);

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <AppNavbar user={user} />
      {children}
    </main>
  );
}
