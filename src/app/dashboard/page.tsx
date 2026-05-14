import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardView } from "@/components/features/dashboard/DashboardView";
import { AppNavbar } from "@/components/features/layout/AppNavbar";
import { getDashboardData, getSessionUser, sessionCookieName } from "@/lib/db";

export default async function DashboardPage() {
  const user = await getSessionUser((await cookies()).get(sessionCookieName)?.value);

  if (!user) {
    redirect("/login");
  }

  const dashboard = await getDashboardData(user);

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <AppNavbar user={user} />
      <DashboardView dashboard={dashboard} />
    </main>
  );
}
