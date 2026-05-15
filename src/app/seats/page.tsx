import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/features/layout/AppNavbar";
import { SeatManagement } from "@/components/features/ticket-seat/SeatManagement";
import { getSessionUser, sessionCookieName } from "@/lib/db";

export default async function SeatsPage() {
  const user = await getSessionUser((await cookies()).get(sessionCookieName)?.value);

  if (!user) {
    redirect("/login");
  }

  const permissions = {
    role: user.role,
    canManageSeat: user.role === "administrator" || user.role === "organizer"
  };

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <AppNavbar user={user} />
      <SeatManagement permissions={permissions} />
    </main>
  );
}
