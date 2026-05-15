import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/features/layout/AppNavbar";
import { ExploreContent } from "@/components/features/explore/ExploreContent";
import { getSessionUser, sessionCookieName } from "@/lib/db";

export default async function ExplorePage() {
  // Ambil sesi user untuk Navbar
  const user = await getSessionUser((await cookies()).get(sessionCookieName)?.value);

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      {/* Navbar tetap muncul di paling atas */}
      <AppNavbar user={user} />
      
      {/* Konten Utama Explore */}
      <ExploreContent />
    </main>
  );
}