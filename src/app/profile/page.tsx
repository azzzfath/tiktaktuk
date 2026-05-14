import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppNavbar } from "@/components/features/layout/AppNavbar";
import { ProfileView } from "@/components/features/profile/ProfileView";
import { getSessionUser, sessionCookieName } from "@/lib/db";

export default async function ProfilePage() {
  const user = await getSessionUser((await cookies()).get(sessionCookieName)?.value);

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-[#F4F4F5]">
      <AppNavbar user={user} />
      <ProfileView user={user} />
    </main>
  );
}
