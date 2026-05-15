import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/features/layout/AppNavbar";
import { PromotionManagement } from "@/components/features/promotion/PromotionManagement";
import { getSessionUser, sessionCookieName } from "@/lib/db";

export default async function PromotionsPage() {
  const user = await getSessionUser((await cookies()).get(sessionCookieName)?.value);

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <AppNavbar user={user} />
      <PromotionManagement role={user.role} />
    </main>
  );
}
