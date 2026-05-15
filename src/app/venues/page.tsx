import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/features/layout/AppNavbar";
import { VenueManagement } from "@/components/features/venue/VenueManagement";
import { getSessionUser, sessionCookieName } from "@/lib/db";

export default async function VenuesPage() {
  const user = await getSessionUser((await cookies()).get(sessionCookieName)?.value);

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <AppNavbar user={user} />
      <VenueManagement role={user.role} />
    </main>
  );
}