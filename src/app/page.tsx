import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser, sessionCookieName } from "@/lib/db";

export default async function HomePage() {
  const user = await getSessionUser(cookies().get(sessionCookieName)?.value);

  redirect(user ? "/dashboard" : "/login");
}
