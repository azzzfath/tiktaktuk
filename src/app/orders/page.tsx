import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/features/layout/AppNavbar";
import { OrderManagement } from "@/components/features/order/OrderManagement";
import { getSessionUser, sessionCookieName } from "@/lib/db";

export default async function OrdersPage() {
  const user = await getSessionUser((await cookies()).get(sessionCookieName)?.value);

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <AppNavbar user={user} />
      <OrderManagement role={user.role} />
    </main>
  );
}
