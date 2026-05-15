import { cookies } from "next/headers";
import { getSessionUser, sessionCookieName } from "@/lib/db";
import { SessionUser, UserRole } from "@/types/auth";

export async function getApiSessionUser() {
  return getSessionUser((await cookies()).get(sessionCookieName)?.value);
}

export function userHasRole(user: SessionUser | null, roles: UserRole[]) {
  return Boolean(user && roles.includes(user.role));
}
