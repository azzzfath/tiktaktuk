import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/features/layout/AppNavbar";
import { EventManagement } from "@/components/features/event/EventManagement";
import { getSessionUser, sessionCookieName } from "@/lib/db";

export default async function EventsPage() {
  const user = await getSessionUser((await cookies()).get(sessionCookieName)?.value);

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <AppNavbar user={user} />
      <EventManagement role={user.role} />
    </main>
  );
}