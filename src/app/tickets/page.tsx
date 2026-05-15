import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/features/layout/AppNavbar";
import { TicketManagement } from "@/components/features/ticket-seat/TicketManagement";
import { getSessionUser, sessionCookieName } from "@/lib/db";

export default async function TicketsPage() {
  const user = await getSessionUser((await cookies()).get(sessionCookieName)?.value);

  if (!user) {
    redirect("/login");
  }

  const permissions = {
    role: user.role,
    canCreateTicket: user.role === "administrator" || user.role === "organizer",
    canManageTicket: user.role === "administrator" || user.role === "organizer"
  };

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <AppNavbar user={user} />
      <TicketManagement permissions={permissions} />
    </main>
  );
}
